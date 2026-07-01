import heapq
import time
from typing import List, Set

class SolitaireState:
    def __init__(self, tableau, stock, waste, foundations, moves_taken=0):
        self.tableau = tableau
        self.stock = stock
        self.waste = waste
        self.foundations = foundations
        self.moves_taken = moves_taken 

    def get_state_hash(self) -> str:
        def hash_pile(pile):
            return tuple(card['id'] for card in pile)
        
        t_hash = tuple(hash_pile(col) for col in self.tableau)
        s_hash = hash_pile(self.stock)
        w_hash = hash_pile(self.waste)
        f_hash = tuple(hash_pile(f) for f in self.foundations)
        return hash((t_hash, s_hash, w_hash, f_hash))

    def is_win(self) -> bool:
        return sum(len(f) for f in self.foundations) == 52

    def calculate_heuristic(self) -> float:
        # h(n): A stronger heuristic.
        # We heavily reward cards in the foundation, and penalize face-down cards.
        foundation_score = sum(len(f) for f in self.foundations) * 5
        face_down_penalty = sum(1 for col in self.tableau for card in col if not card['faceUp']) * 2
        
        # We want to minimize f(n) = g(n) + h(n), so we return a negative score for good things
        # meaning a lower number is better.
        return self.moves_taken - foundation_score + face_down_penalty

    def _is_valid_tableau_move(self, source_card: dict, dest_card: dict) -> bool:
        if not dest_card:
            return source_card['rank'] == 13
        return (source_card['color'] != dest_card['color']) and \
               (source_card['rank'] == dest_card['rank'] - 1)

    def _is_valid_foundation_move(self, suit_idx: int, source_card: dict, dest_card: dict) -> bool:
        SUITS = ["♠", "♥", "♦", "♣"]
        if source_card['suit'] != SUITS[suit_idx]:
            return False
        if not dest_card:
            return source_card['rank'] == 1
        return source_card['rank'] == dest_card['rank'] + 1

    def _clone_state(self) -> 'SolitaireState':
        return SolitaireState(
            tableau=[list(col) for col in self.tableau],
            stock=list(self.stock),
            waste=list(self.waste),
            foundations=[list(f) for f in self.foundations],
            moves_taken=self.moves_taken + 1
        )
        
    def _get_lowest_foundation_rank(self, opposite_color: str) -> int:
        """Helper to find the lowest rank in the foundations for a specific color."""
        lowest = 14 # Start higher than King
        SUITS = ["♠", "♥", "♦", "♣"]
        for f_idx, suit in enumerate(SUITS):
            color = "red" if suit in ["♦", "♥"] else "black"
            if color == opposite_color:
                rank = self.foundations[f_idx][-1]['rank'] if self.foundations[f_idx] else 0
                if rank < lowest:
                    lowest = rank
        return lowest if lowest != 14 else 0

    def get_valid_moves(self) -> list['SolitaireState']:
        possible_new_states = []

        # 0. DOMINANCE HEURISTIC: AUTO-PLAY SAFE CARDS
        # If a card can safely go to the foundation without blocking any future moves,
        # we MUST do it immediately and ignore all other moves.
        # A move to foundation is "safe" if all opposite-color cards of rank-1 are already in the foundation.
        
        # Check Tableau tops
        for t_idx in range(7):
            if not self.tableau[t_idx]:
                continue
            card = self.tableau[t_idx][-1]
            for f_idx in range(4):
                top_f_card = self.foundations[f_idx][-1] if self.foundations[f_idx] else None
                if self._is_valid_foundation_move(f_idx, card, top_f_card):
                    # Is it safe?
                    opposite_color = "red" if card['color'] == "black" else "black"
                    lowest_opp_rank = self._get_lowest_foundation_rank(opposite_color)
                    
                    if card['rank'] <= lowest_opp_rank + 1 or card['rank'] <= 2:
                        # IT IS SAFE! Play it and return ONLY this state.
                        new_state = self._clone_state()
                        c = new_state.tableau[t_idx].pop()
                        new_state.foundations[f_idx].append(c)
                        if new_state.tableau[t_idx] and not new_state.tableau[t_idx][-1]['faceUp']:
                            new_state.tableau[t_idx][-1] = new_state.tableau[t_idx][-1].copy()
                            new_state.tableau[t_idx][-1]['faceUp'] = True
                        return [new_state] # Prune the entire branch!

        # Check Waste top
        if self.waste:
            card = self.waste[-1]
            for f_idx in range(4):
                top_f_card = self.foundations[f_idx][-1] if self.foundations[f_idx] else None
                if self._is_valid_foundation_move(f_idx, card, top_f_card):
                    opposite_color = "red" if card['color'] == "black" else "black"
                    lowest_opp_rank = self._get_lowest_foundation_rank(opposite_color)
                    if card['rank'] <= lowest_opp_rank + 1 or card['rank'] <= 2:
                        new_state = self._clone_state()
                        c = new_state.waste.pop()
                        new_state.foundations[f_idx].append(c)
                        return [new_state] # Prune!

        # Standard Moves (If no safe dominance exists)
        
        # 1. WASTE TO FOUNDATION
        if self.waste:
            waste_card = self.waste[-1]
            for f_idx in range(4):
                top_f_card = self.foundations[f_idx][-1] if self.foundations[f_idx] else None
                if self._is_valid_foundation_move(f_idx, waste_card, top_f_card):
                    new_state = self._clone_state()
                    card_to_move = new_state.waste.pop()
                    new_state.foundations[f_idx].append(card_to_move)
                    possible_new_states.append(new_state)

        # 2. WASTE TO TABLEAU
        if self.waste:
            waste_card = self.waste[-1]
            for t_idx in range(7):
                top_t_card = self.tableau[t_idx][-1] if self.tableau[t_idx] else None
                if self._is_valid_tableau_move(waste_card, top_t_card):
                    new_state = self._clone_state()
                    card_to_move = new_state.waste.pop()
                    new_state.tableau[t_idx].append(card_to_move)
                    possible_new_states.append(new_state)

        # 3. TABLEAU TO FOUNDATION
        for t_idx in range(7):
            if not self.tableau[t_idx]:
                continue
            tableau_card = self.tableau[t_idx][-1]
            for f_idx in range(4):
                top_f_card = self.foundations[f_idx][-1] if self.foundations[f_idx] else None
                if self._is_valid_foundation_move(f_idx, tableau_card, top_f_card):
                    new_state = self._clone_state()
                    card_to_move = new_state.tableau[t_idx].pop()
                    new_state.foundations[f_idx].append(card_to_move)
                    if new_state.tableau[t_idx] and not new_state.tableau[t_idx][-1]['faceUp']:
                        new_state.tableau[t_idx][-1] = new_state.tableau[t_idx][-1].copy()
                        new_state.tableau[t_idx][-1]['faceUp'] = True
                    possible_new_states.append(new_state)

        # 4. TABLEAU TO TABLEAU
        for from_t in range(7):
            if not self.tableau[from_t]:
                continue
            for card_idx, card in enumerate(self.tableau[from_t]):
                if not card['faceUp']:
                    continue
                
                reveals_hidden = card_idx > 0 and not self.tableau[from_t][card_idx - 1]['faceUp']
                frees_king = card['rank'] == 13 and card_idx > 0
                
                if not reveals_hidden and not frees_king:
                    continue
                    
                for to_t in range(7):
                    if from_t == to_t:
                        continue
                    top_dest_card = self.tableau[to_t][-1] if self.tableau[to_t] else None
                    if self._is_valid_tableau_move(card, top_dest_card):
                        new_state = self._clone_state()
                        stack_to_move = new_state.tableau[from_t][card_idx:]
                        new_state.tableau[from_t] = new_state.tableau[from_t][:card_idx]
                        new_state.tableau[to_t].extend(stack_to_move)
                        if new_state.tableau[from_t] and not new_state.tableau[from_t][-1]['faceUp']:
                            new_state.tableau[from_t][-1] = new_state.tableau[from_t][-1].copy()
                            new_state.tableau[from_t][-1]['faceUp'] = True
                        possible_new_states.append(new_state)

        # 5. DRAW FROM STOCK OR RECYCLE
        # (Putting this last means the AI prioritizes moving cards already on the board)
        if self.stock or self.waste:
            new_state = self._clone_state()
            if new_state.stock:
                card = new_state.stock.pop().copy()
                card['faceUp'] = True
                new_state.waste.append(card)
            else:
                new_state.stock = new_state.waste[::-1]
                for i in range(len(new_state.stock)):
                    new_state.stock[i] = new_state.stock[i].copy()
                    new_state.stock[i]['faceUp'] = False
                new_state.waste = []
            possible_new_states.append(new_state)

        return possible_new_states

    def __lt__(self, other):
        return self.calculate_heuristic() < other.calculate_heuristic()


class AISolver:
    def __init__(self, timeout_seconds=5.0):
        self.timeout = timeout_seconds

    def is_solvable(self, initial_state: SolitaireState) -> bool:
        open_set = [] 
        heapq.heappush(open_set, initial_state)
        
        # Use the new tuple hash
        visited: Set[int] = set()
        
        start_time = time.time()
        states_evaluated = 0

        while open_set:
            if time.time() - start_time > self.timeout:
                print(f"AI Timeout. Evaluated {states_evaluated} states.")
                return False

            current_state = heapq.heappop(open_set)
            states_evaluated += 1

            if current_state.is_win():
                print(f"AI Solved it! Path length: {current_state.moves_taken}. States checked: {states_evaluated}")
                return True

            state_hash = current_state.get_state_hash()
            if state_hash in visited:
                continue
            
            visited.add(state_hash)

            for next_state in current_state.get_valid_moves():
                if next_state.get_state_hash() not in visited:
                    heapq.heappush(open_set, next_state)

        print(f"Exhausted all moves. Unsolvable. States checked: {states_evaluated}")
        return False
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CardModel(BaseModel):
    suit: str
    value: str  
    rank: int   
    faceUp: bool
    color: str
    id: str

class DailyChallengePayload(BaseModel):
    challenge_id: str
    tableau: List[List[CardModel]]
    stock: List[CardModel]

SUITS = ["♠", "♥", "♦", "♣"]
RANKS = [
    {"value": "A", "rank": 1},
    {"value": "2", "rank": 2},
    {"value": "3", "rank": 3},
    {"value": "4", "rank": 4},
    {"value": "5", "rank": 5},
    {"value": "6", "rank": 6},
    {"value": "7", "rank": 7},
    {"value": "8", "rank": 8},
    {"value": "9", "rank": 9},
    {"value": "10", "rank": 10},
    {"value": "J", "rank": 11},
    {"value": "Q", "rank": 12},
    {"value": "K", "rank": 13},
]

@app.get("/api/daily-challenge", response_model=DailyChallengePayload)
def get_daily_challenge():
    # 1. Generate the initial deck (Unshuffled for Iteration 1)
    deck: List[CardModel] = []
    for suit in SUITS:
        for rank_info in RANKS:
            deck.append(CardModel(
                suit=suit,
                value=str(rank_info["value"]),
                rank=int(rank_info["rank"]),
                faceUp=False,
                color="red" if suit in ["♦", "♥"] else "black",
                id=f"{suit}-{rank_info['value']}"
            ))

    # 2. Deal into Tableaus mimicking your frontend logic exactly
    tableau = [[], [], [], [], [], [], []]
    
    for i in range(7):
        for j in range(i, 7):
            card = deck.pop() # Pops from the end, exactly like your JS Stack
            card.faceUp = (i == j)
            tableau[j].append(card)

    # 3. The remaining 24 cards become the stock.
    # Because your JS pushes the remaining stack into a Queue, 
    # we just reverse the remaining list to maintain the exact same draw order.
    stock = deck[::-1] 

    return DailyChallengePayload(
        challenge_id="iteration-1-unshuffled",
        tableau=tableau,
        stock=stock
    )
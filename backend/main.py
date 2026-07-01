from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import random
from solver import SolitaireState, AISolver

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


class ScoreSubmission(BaseModel):
    challenge_id: str
    username: str
    time: int
    moves: int
    score: int


class LeaderboardEntry(BaseModel):
    username: str
    time: int
    moves: int
    score: int
    date: str


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

leaderboard_db = [
    {
        "username": "Tasawar (Creator)",
        "time": 145,
        "moves": 92,
        "score": 500,
        "date": "2026-07-01",
    },
    {
        "username": "UET_Challenger",
        "time": 190,
        "moves": 110,
        "score": 420,
        "date": "2026-07-01",
    },
]


@app.get("/api/daily-challenge", response_model=DailyChallengePayload)
def get_daily_challenge():
    
    solver = AISolver(timeout_seconds=15.0)
    MAX_ATTEMPTS = 10

    for attempt in range(MAX_ATTEMPTS):
        deck: List[CardModel] = []

        for suit in SUITS:
            for rank_info in RANKS:
                deck.append(
                    CardModel(
                        suit=suit,
                        value=str(rank_info["value"]),
                        rank=int(rank_info["rank"]),
                        faceUp=False,
                        color="red" if suit in ["♦", "♥"] else "black",
                        id=f"{suit}-{rank_info['value']}",
                    )
                )

        random.shuffle(deck)

        tableau = [[], [], [], [], [], [], []]

        for i in range(7):
            for j in range(i, 7):
                card = deck.pop()
                card.faceUp = i == j
                tableau[j].append(card)

        stock = deck[::-1]

        # --- THE FIX: Convert heavy Pydantic models to lightweight dicts ---
        # Note: If you are using Pydantic V2, you can also use card.model_dump()
        solver_tableau = [[card.dict() for card in col] for col in tableau]
        solver_stock = [card.dict() for card in stock]

        is_winnable = solver.is_solvable(
            SolitaireState(solver_tableau, solver_stock, [], [[], [], [], []])
        )

        if is_winnable:
            print(f"Solvable board found on attempt {attempt + 1}!")
            return DailyChallengePayload(
                challenge_id=f"daily-{datetime.now().strftime('%Y%m%d')}",
                tableau=tableau, 
                stock=stock
            )
        else:
            print(f"Attempt {attempt + 1} unsolvable. Reshuffling...")

    # Failsafe: If it times out 10 times, just return the last generated board
    # so your frontend doesn't crash while testing.
    print("Warning: Max attempts reached. Returning unverified board.")
    return DailyChallengePayload(
        challenge_id=f"daily-{datetime.now().strftime('%Y%m%d')}-unverified",
        tableau=tableau, 
        stock=stock
    )
    
    
@app.post("/api/daily-challenge/score", response_model=List[LeaderboardEntry])
@limiter.limit("5/minute")
def submit_score(request: Request, submission: ScoreSubmission):

    new_entry = {
        "username": submission.username,
        "time": submission.time,
        "moves": submission.moves,
        "score": submission.score,
        "date": datetime.now().strftime("%Y-%m-%d"),
    }

    leaderboard_db.append(new_entry)

    sorted_leaderboard = sorted(leaderboard_db, key=lambda x: (x["time"], x["moves"]))

    return sorted_leaderboard[:10]


@app.get("/api/daily-challenge/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard():
    sorted_leaderboard = sorted(leaderboard_db, key=lambda x: (x["time"], x["moves"]))
    return sorted_leaderboard[:10]

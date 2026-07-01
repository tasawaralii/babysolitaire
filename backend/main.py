import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import random

from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager

from solver import SolitaireState, AISolver

from schemas import DailyChallengePayload, ScoreSubmission, LeaderboardEntry
from constants import SUITS, RANKS

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

leaderboard_db = []

current_daily_seed = {
    "date": None,
    "payload": None
}

def generate_daily_challenge():
    """Runs at midnight to pre-compute and cache the next solvable board."""
    global current_daily_seed, leaderboard_db, SUITS, RANKS
    print("\n--- [SCHEDULER] Starting Daily AI Generation ---")
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    leaderboard_db.clear()
    
    solver = AISolver(timeout_seconds=15.0)
    MAX_ATTEMPTS = 30

    for attempt in range(MAX_ATTEMPTS):
        deck = []
        for suit in SUITS:
            for rank_info in RANKS:
                deck.append({
                    "suit": suit,
                    "value": str(rank_info["value"]),
                    "rank": int(rank_info["rank"]),
                    "faceUp": False,
                    "color": "red" if suit in ["♦", "♥"] else "black",
                    "id": f"{suit}-{rank_info['value']}"
                })

        random.shuffle(deck)

        tableau = [[], [], [], [], [], [], []]
        for i in range(7):
            for j in range(i, 7):
                card = deck.pop()
                card["faceUp"] = (i == j)
                tableau[j].append(card)

        stock = deck[::-1]

        is_winnable = solver.is_solvable(
            SolitaireState(tableau, stock, [], [[], [], [], []])
        )

        if is_winnable:
            print(f"[SCHEDULER] Success! Solvable board locked in on attempt {attempt + 1}.")
            
            # Save to global cache
            current_daily_seed["date"] = today_str
            current_daily_seed["payload"] = DailyChallengePayload(
                challenge_id=f"daily-{today_str}",
                tableau=tableau,
                stock=stock
            )
            return

    print("[SCHEDULER] WARNING: Failed to find a solvable board. Falling back to unverified.")
    # Fallback just in case
    current_daily_seed["date"] = today_str
    current_daily_seed["payload"] = DailyChallengePayload(
        challenge_id=f"daily-{today_str}-unverified",
        tableau=tableau,
        stock=stock
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(generate_daily_challenge, 'cron', hour=0, minute=0)
    scheduler.start()
    
    # Generate the first daily challenge immediately on startup
    generate_daily_challenge()

    yield

    scheduler.shutdown()
    
    
app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

frontend_env = os.getenv("FRONTEND_DOMAIN", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in frontend_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/daily-challenge", response_model=DailyChallengePayload)
def get_daily_challenge():
    global current_daily_seed
    
    if current_daily_seed["payload"] is None:

        raise HTTPException(status_code=503, detail="Daily challenge is currently generating. Please try again in 10 seconds.")
        
    return current_daily_seed["payload"]
    
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

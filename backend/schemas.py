from pydantic import BaseModel
from typing import List


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

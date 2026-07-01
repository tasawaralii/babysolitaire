from pydantic import BaseModel
from typing import List

class CardModel(BaseModel):
    suit: str
    value: int
    rank: str
    faceUp: bool
    color: str
    id: str

class DailyChallengePayload(BaseModel):
    challenge_id: str
    tableau: List[List[CardModel]]
    stock: List[CardModel]
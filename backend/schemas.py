from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    title: str
    category: str
    description: str
    location: str
    image_url: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    priority: str
    ml_confidence: Optional[float] = None
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "user"

class UserResponse(UserBase):
    id: int
    role: str
    complaints: List[ComplaintResponse] = []

    class Config:
        from_attributes = True

class PriorityPrediction(BaseModel):
    priority: str
    confidence: float

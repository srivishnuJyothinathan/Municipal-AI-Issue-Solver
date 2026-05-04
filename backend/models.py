from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Normally hashed, plaintext for demo if we skip hashing
    role = Column(String, default="user") # 'user' or 'admin'

    complaints = relationship("Complaint", back_populates="owner")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True) # water, garbage, road, electricity
    description = Column(Text)
    location = Column(String) # text description or GPS coordinates
    image_url = Column(String, nullable=True)
    
    status = Column(String, default="Pending") # Pending, In Progress, Resolved
    priority = Column(String, default="Low") # Low, Medium, High
    ml_confidence = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="complaints")

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
from database import engine, get_db
from ml_engine import predictor

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Municipal Colony Priority Issue Solver")

# CORS Setup for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login/")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if not db_user or db_user.password != user.password: # Plaintext for demo
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"id": db_user.id, "username": db_user.username, "role": db_user.role}

@app.post("/complaints/", response_model=schemas.ComplaintResponse)
def create_complaint(complaint: schemas.ComplaintCreate, user_id: int, db: Session = Depends(get_db)):
    # Run ML Prediction
    priority, confidence = predictor.predict_priority(complaint.description, complaint.category)
    
    return crud.create_user_complaint(
        db=db, 
        complaint=complaint, 
        user_id=user_id, 
        priority=priority, 
        ml_confidence=confidence
    )

@app.get("/complaints/", response_model=List[schemas.ComplaintResponse])
def read_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_complaints(db, skip=skip, limit=limit)

@app.get("/complaints/user/{user_id}", response_model=List[schemas.ComplaintResponse])
def read_user_complaints(user_id: int, db: Session = Depends(get_db)):
    return crud.get_complaints_by_user(db, user_id=user_id)

@app.put("/complaints/{complaint_id}/status", response_model=schemas.ComplaintResponse)
def update_status(complaint_id: int, status_update: schemas.ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = crud.update_complaint_status(db, complaint_id, status_update.status)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

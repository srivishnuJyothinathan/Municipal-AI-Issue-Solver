from sqlalchemy.orm import Session
from models import User, Complaint
from schemas import UserCreate, ComplaintCreate, ComplaintUpdate

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username, password=user.password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_complaints(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Complaint).order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()

def get_complaints_by_user(db: Session, user_id: int):
    return db.query(Complaint).filter(Complaint.owner_id == user_id).order_by(Complaint.created_at.desc()).all()

def create_user_complaint(db: Session, complaint: ComplaintCreate, user_id: int, priority: str, ml_confidence: float):
    db_complaint = Complaint(
        **complaint.model_dump(), 
        owner_id=user_id,
        priority=priority,
        ml_confidence=ml_confidence
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

def update_complaint_status(db: Session, complaint_id: int, status: str):
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if db_complaint:
        db_complaint.status = status
        db.commit()
        db.refresh(db_complaint)
    return db_complaint

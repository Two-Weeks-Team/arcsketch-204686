from sqlalchemy import create_engine, Column, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

Base = declarative_base()

# Auto-fix database URL for PostgreSQL dialect
DB_URL = os.getenv("DATABASE_URL", os.getenv("POSTGRES_URL", "sqlite:///./app.db"))
if DB_URL.startswith("postgresql+asyncpg://"):
    DB_URL = DB_URL.replace("postgresql+asyncpg://", "postgresql+psycopg://")
elif DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql+psycopg://")

# Add SSL mode if needed
if not DB_URL.startswith("sqlite://"):
    if "sslmode" not in DB_URL:
        if "localhost" not in DB_URL:
            DB_URL += "?sslmode=require"

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Example model for AI Snap Predictions
class AiSnapPrediction(Base):
    __tablename__ = "ai_snap_predictions"

    id = Column(String, primary_key=True)
    element_id = Column(String, nullable=False)
    project_id = Column(String, nullable=False)
    predicted_json = Column(String, nullable=False)
    confidence_score = Column(String, nullable=False)
    suggested_material = Column(String)
    reasoning_text = Column(String)
    requested_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String, nullable=False)

# Example model for AI Suggest Results
class AiSuggestResult(Base):
    __tablename__ = "ai_suggest_results"

    id = Column(String, primary_key=True)
    object_id = Column(String, nullable=False)
    project_id = Column(String, nullable=False)
    material = Column(String, nullable=False)
    code_reference = Column(String, nullable=False)
    confidence = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
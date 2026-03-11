from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from models import AiSnapPrediction, AiSuggestResult, SessionLocal
from sqlalchemy.orm import Session
from ai_service import call_inference
import json

app = FastAPI()

# Dependency to get DB session
async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/projects/{project_id}/ai/snap")
async def ai_snap(project_id: str, data: dict = Body(...), db: Session = Depends(get_db)):
    # Call AI inference for snapping
    response = await call_inference(data)

    # Save prediction to database
    prediction = AiSnapPrediction(
        id=str(uuid.uuid4()),
        element_id=data.get("element_id"),
        project_id=project_id,
        predicted_json=json.dumps(response.get("snapped_objects", [])),
        confidence_score=str(response.get("confidence", 0.0)),
        model_version="openai-gpt-oss-120b"
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return JSONResponse(status_code=200, content=response)

@app.post("/projects/{project_id}/ai/suggest")
async def ai_suggest(project_id: str, data: dict = Body(...), db: Session = Depends(get_db)):
    # Call AI inference for suggestions
    response = await call_inference(data)

    # Save suggestion to database
    suggestion = AiSuggestResult(
        id=str(uuid.uuid4()),
        object_id=data.get("object_ids", [""])[0],
        project_id=project_id,
        material=response.get("suggestions", [{}])[0].get("material", "") if response.get("suggestions") else "",
        code_reference=response.get("suggestions", [{}])[0].get("code_reference", "") if response.get("suggestions") else "",
        confidence=str(response.get("suggestions", [{}])[0].get("confidence", 0.0)) if response.get("suggestions") else "0.0"
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)

    return JSONResponse(status_code=200, content=response)
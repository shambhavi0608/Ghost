from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional

from streamlit import image
from services.exposure_engine import generate_risk_analysis
from utils.image_tools import analyze_image
from services.cleanup import cleanup_session
from services.identity_search import search_identity
from services.summary_engine import generate_summary
from recommendations.recommendations import generate_recommendations
from recommendations.checklist import generate_checklist
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Ghost backend running"}


@app.post("/analyze")
async def analyze(
    tracker_count: int = Form(...),
    entropy_score: int = Form(...),
    permission_count: int = Form(...),
    fingerprint_id: str = Form(...),
    image: Optional[UploadFile] = File(None)
):

    image_data = None

    if image:
        image_data = await analyze_image(image)

    image_risk = "LOW"

    if image_data:
        image_risk = image_data["traceability_risk"]

    analysis = generate_risk_analysis(
        tracker_count,
        entropy_score,
        permission_count,
        image_risk
)

    face_tag = "unknown_subject"

    if image_data:
        face_tag = image_data["face_tag"]

    identity_matches = search_identity(
        fingerprint_id,
        face_tag
    )
    identity_summary = generate_summary(identity_matches)
    recommendations = generate_recommendations(
        tracker_count,
        permission_count,
        entropy_score,
        len(identity_matches),
        image_risk
    )

    checklist = generate_checklist(
        tracker_count,
        permission_count,
        entropy_score,
        len(identity_matches),
        image_risk
    )
    cleanup_info = cleanup_session()
    return {
        "status": "success",
        "analysis": analysis,
        "identity_matches": identity_matches,
        "identity_summary": identity_summary,
        "image_analysis": image_data,
        "privacy": cleanup_info,
        "recommendations": recommendations,
        "checklist": checklist
    }
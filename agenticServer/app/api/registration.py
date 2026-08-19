from fastapi import APIRouter

from app.services.registration_service import (
    analyze_registration
)


router = APIRouter(
    prefix="/registration",
    tags=["Registration"]
)


@router.get("/{student_id}/{course_code}")
def analyze(
    student_id: str,
    course_code: str
):

    return analyze_registration(
        student_id,
        course_code
    )
from fastapi import APIRouter
from app.services.student_service import find_student


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get("/{student_id}")
def get_student(student_id: str):

    return find_student(student_id)
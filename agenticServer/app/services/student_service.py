from app.repositories.student_repository import get_student


def find_student(student_id: str):

    return get_student(student_id)
from app.repositories.student_repository import get_student
from app.repositories.course_repository import get_course
from app.rules.eligibility import check_student_eligibility


def analyze_registration(
    student_id: str,
    course_code: str
):

    student = get_student(student_id)

    course = get_course(course_code)

    if not student:
        return {"error": "Student not found"}

    if not course:
        return {"error": "Course not found"}

    result = check_student_eligibility(
        student,
        course
    )

    return {
        "student": student.student_id,
        "course": course.code,
        **result
    }
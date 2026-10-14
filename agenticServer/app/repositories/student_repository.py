from app.models.student import Student


def get_student(student_id: str):

    return Student(
        student_id=student_id,
        name="John",
        gpa=3.2,
        completed_courses=[
            "CS101",
            "CS102",
            "CS201"
        ]
    )
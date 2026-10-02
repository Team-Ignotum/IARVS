from app.models.course import Course


courses = {

    "CS301": Course(
        code="CS301",
        name="Advanced Programming",
        credits=3,
        prerequisites=[
            "CS201",
            "CS202"
        ]
    ),

    "CS401": Course(
        code="CS401",
        name="Software Architecture",
        credits=4,
        prerequisites=[
            "CS301"
        ]
    )
}


def get_course(code: str):

    return courses.get(code)
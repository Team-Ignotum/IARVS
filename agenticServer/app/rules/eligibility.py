from app.rules.engine import RuleEngine
from app.rules.facts import StudentFacts


engine = RuleEngine()


def check_student_eligibility(student, course):

    facts = StudentFacts(
        completed_courses=set(
            student.completed_courses
        ),
        gpa=student.gpa
    )

    return engine.check_eligibility(
        facts,
        course
    )
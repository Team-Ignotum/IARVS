from dataclasses import dataclass


@dataclass
class StudentFacts:

    completed_courses: set[str]
    gpa: float
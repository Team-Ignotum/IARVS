def prerequisite_rule(facts, course):

    missing = [
        prerequisite
        for prerequisite in course.prerequisites
        if prerequisite not in facts.completed_courses
    ]

    if missing:
        return {
            "passed": False,
            "reason": "Missing prerequisites",
            "missing": missing
        }

    return {
        "passed": True
    }


def gpa_rule(facts):

    if facts.gpa < 2.0:

        return {
            "passed": False,
            "reason": "GPA below minimum requirement"
        }

    return {
        "passed": True
    }
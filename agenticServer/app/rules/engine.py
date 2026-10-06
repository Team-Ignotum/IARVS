from app.rules.rules import (
    prerequisite_rule,
    gpa_rule
)


class RuleEngine:

    def check_eligibility(self, facts, course):

        results = []

        # Forward chaining
        prerequisite_result = prerequisite_rule(
            facts,
            course
        )

        results.append(prerequisite_result)

        gpa_result = gpa_rule(facts)

        results.append(gpa_result)

        eligible = all(
            result["passed"]
            for result in results
        )

        return {
            "eligible": eligible,
            "rules": results
        }
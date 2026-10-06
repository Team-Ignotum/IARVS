def search_policy(query: str):

    policies = [
        {
            "title": "Credit Limit Policy",
            "content": "Students may register for a maximum of 18 credits."
        },
        {
            "title": "Prerequisite Policy",
            "content": "Students must complete prerequisite courses before registration."
        }
    ]

    return [
        policy
        for policy in policies
        if query.lower() in policy["content"].lower()
    ]
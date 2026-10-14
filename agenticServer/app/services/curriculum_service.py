def map_course(old_course: str):

    mapping = {
        "CS201": "CS203",
        "CS202": "CS204"
    }

    return mapping.get(old_course)
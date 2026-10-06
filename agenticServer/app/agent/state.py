from typing import TypedDict


class AgentState(TypedDict):

    message: str
    student_id: str
    response: str
from langgraph.graph import StateGraph, END

from app.agent.state import AgentState
from app.services.registration_service import (
    analyze_registration
)


def eligibility_node(state: AgentState):

    result = analyze_registration(
        state["student_id"],
        "CS301"
    )

    state["response"] = str(result)

    return state


graph = StateGraph(AgentState)

graph.add_node(
    "eligibility",
    eligibility_node
)

graph.set_entry_point("eligibility")

graph.add_edge(
    "eligibility",
    END
)

agent = graph.compile()
import networkx as nx


class DependencyGraph:

    def __init__(self):

        self.graph = nx.DiGraph()

    def add_course(
        self,
        course: str,
        prerequisites: list[str]
    ):

        for prerequisite in prerequisites:

            self.graph.add_edge(
                prerequisite,
                course
            )

    def get_dependencies(
        self,
        course: str
    ):

        return list(
            nx.ancestors(
                self.graph,
                course
            )
        )

    def get_dependents(
        self,
        course: str
    ):

        return list(
            nx.descendants(
                self.graph,
                course
            )
        )
from pydantic import BaseModel


class Student(BaseModel):

    student_id: str
    name: str
    gpa: float

    class Config:
        from_attributes = True
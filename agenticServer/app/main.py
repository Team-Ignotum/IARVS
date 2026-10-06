from fastapi import FastAPI

from app.api.students import router as student_router
from app.api.registration import router as registration_router


app = FastAPI(
    title="IARVS Backend",
    version="0.1.0"
)


app.include_router(student_router)
app.include_router(registration_router)


@app.get("/")
def root():

    return {
        "system": "IARVS",
        "status": "running"
    }
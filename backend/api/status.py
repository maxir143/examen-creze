from fastapi import APIRouter
from models.response import SuccessResponse


status_router = APIRouter(
    prefix="/status",
    tags=["HEALTH"],
)


@status_router.get("", response_model=SuccessResponse)
def _status():
    return SuccessResponse(message="OK")

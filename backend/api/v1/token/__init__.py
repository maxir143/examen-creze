from fastapi import APIRouter
from .activate import activate_router
from .refresh import refresh_router


token_router = APIRouter(prefix="/token", tags=["TOKEN"])

token_router.include_router(activate_router)
token_router.include_router(refresh_router)

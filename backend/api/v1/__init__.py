from fastapi import APIRouter
from .user import user_router
from .token import token_router
from .otp import otp_router
from .transaction import transaction_router


v1_router = APIRouter(prefix="/v1")

v1_router.include_router(user_router)
v1_router.include_router(token_router)
v1_router.include_router(otp_router)
v1_router.include_router(transaction_router)

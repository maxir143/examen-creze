from fastapi import APIRouter
from .sync import sync_router

otp_router = APIRouter(prefix="/otp", tags=["OTP"])

otp_router.include_router(sync_router)

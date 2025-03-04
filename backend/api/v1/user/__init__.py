from fastapi import APIRouter
from .login import login_router
from .log_out import log_out_router
from .sign_up import sign_up_router


user_router = APIRouter(prefix="/user", tags=["USER"])

user_router.include_router(login_router)
user_router.include_router(sign_up_router)
user_router.include_router(log_out_router)

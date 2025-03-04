from fastapi import APIRouter
from .create import create_router

transaction_router = APIRouter(prefix="/transaction", tags=["TRANSACTION"])

transaction_router.include_router(create_router)

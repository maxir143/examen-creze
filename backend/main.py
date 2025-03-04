from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from middleware.error_handler import (
    HTTPException_handler,
    ValidationError_handler,
    error_handler,
)
from models.response import ErrorResponse
from repository.db import init_db, get_db
from config import Settings
from api.v1 import v1_router

settings = Settings()


@asynccontextmanager
async def lifespan(_app):
    init_db(get_db(settings.DATABASE_NAME))
    yield


app = FastAPI(
    lifespan=lifespan,
    docs_url=f"{settings.BASE_PATH}/docs",
    openapi_url=f"{settings.BASE_PATH}/docs/json",
)
app.exception_handlers = {
    HTTPException: HTTPException_handler,
    StarletteHTTPException: HTTPException_handler,
    ValidationError: ValidationError_handler,
    RequestValidationError: ValidationError_handler,
}
app.middleware("http")(error_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    v1_router,
    prefix=settings.BASE_PATH,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)

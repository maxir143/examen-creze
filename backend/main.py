from datetime import datetime, timedelta, timezone
from typing import Annotated
from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from passlib.hash import pbkdf2_sha256
from middleware.error_handler import error_handler
from repository.users import (
    create_user,
    create_login_attempt,
    delete_login_attempts,
    get_login_attempts,
    get_user,
    register_token,
    remove_token,
)
from repository.db import init_db, get_db
from utils.token import activate_token, extract_token, get_otp_uri, session_token
from config import Settings


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
app.middleware("http")(error_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class _BasicAuth(BaseModel):
    email: str = Field(
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        examples=["0BjL7@example.com"],
    )
    password: str = Field(
        description="Password must be at least 8 characters long",
        min_length=8,
        examples=["12345678"],
    )


class _TokenAuth(BaseModel):
    token: str


api_router = APIRouter(prefix=settings.BASE_PATH)


@api_router.post("/user/login", tags=["user"])
def _user_login(request: _BasicAuth):
    user = get_user(request.email)

    if not user:
        raise ValueError("User not found")

    if user.account_locked_until:
        if datetime.fromisoformat(user.account_locked_until) >= datetime.now(
            tz=timezone.utc
        ):
            raise ValueError(
                f"User account is locked until: {user.account_locked_until} UTC"
            )

        user.account_locked_until = None
        user.save()
        delete_login_attempts(user.email)

    failed_attepts = get_login_attempts(request.email, 60)

    if failed_attepts >= 5:
        user.account_locked_until = datetime.now(tz=timezone.utc) + timedelta(hours=1)
        user.save()
        raise ValueError("User has been locked for 1 hour")

    password_valid = pbkdf2_sha256.verify(request.password, user.password_hash)

    if not password_valid:
        create_login_attempt(request.email, request.password)
        raise ValueError(f"Password is not valid, {5 - failed_attepts} attempts left")

    delete_login_attempts(user.email)

    return {
        "message": "User logged in successfully",
        "token": session_token(str(user.id), user.email),
    }


@api_router.post("/user/sing-up", tags=["user"])
def _user_sing_up(request: _BasicAuth):
    if not create_user(email=request.email, password=request.password):
        raise ValueError("User cant be created")
    return {"message": f"User registered successfully with email: {request.email}"}


@api_router.get("/token/activate/{otp_code}", tags=["token"])
def _token_activate(
    otp_code: str, x_token: Annotated[str | None, Header()] = None
) -> dict:
    active_token = activate_token(x_token, otp_code)
    token_object = extract_token(active_token)
    register_token(token_object.email, token_object.id)

    return {
        "message": "User logged in successfully",
        "token": active_token,
    }


@api_router.get("/user/log-out", tags=["user"])
def _user_log_out(x_token: Annotated[str | None, Header()] = None):
    token = extract_token(x_token)
    user = get_user(token.email)
    if not user:
        raise ValueError("User not found")
    if str(user.token_id) != str(token.id):
        raise ValueError("Token is not valid, please login again")
    remove_token(token.email)
    return {"message": "User logout successfully"}


@api_router.get("/token/refresh", tags=["token"])
def _token_refresh(x_token: Annotated[str | None, Header()] = None):
    token = extract_token(x_token)

    if not token.active:
        raise ValueError("Token is not active")

    if token.refresh_exp < datetime.now(tz=timezone.utc).timestamp():
        raise ValueError("Token is expired")

    user = get_user(token.email)
    if not user:
        raise ValueError("User not found")
    print(user.token_id, token.id)
    if str(user.token_id) != str(token.id):
        raise ValueError("Refresh token is not valid, please login again")

    new_token = session_token(str(user.id), user.email, active=True)
    new_token_object = extract_token(new_token)
    register_token(new_token_object.email, new_token_object.id)

    return {"message": "Token refreshed successfully", "token": new_token}


@api_router.get("/otp/sync", tags=["OTP"])
def _otp_sync(x_token: Annotated[str | None, Header()] = None):
    otp_uri = get_otp_uri(x_token)
    return {"message": "OTP url generated successfully", "otp_uri": otp_uri}


app.include_router(api_router)

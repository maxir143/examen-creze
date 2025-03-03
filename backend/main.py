from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import FastAPI, Header
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
)
from repository.db import init_db, get_db
from utils.token import activate_token, extract_token, get_otp_uri, session_token
from config import Settings


settings = Settings()


# lifespan
@asynccontextmanager
async def lifespan(_app):
    # On startup
    init_db(get_db(settings.DATABASE_NAME))
    yield
    # On shutdown


app = FastAPI(lifespan=lifespan)
app.middleware("http")(error_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# endpoints
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


@app.post("/sing-up")
def _sing_up(request: _BasicAuth):
    if not create_user(email=request.email, password=request.password):
        raise ValueError("User cant be created")
    return {"message": f"User registered successfully with email: {request.email}"}


@app.post("/login")
def _login(request: _BasicAuth):
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
        create_login_attempt(request.email, request.password, False)
        raise ValueError(f"Password is not valid, {5 - failed_attepts} attempts left")

    delete_login_attempts(user.email)

    return {
        "message": "User logged in successfully",
        "token": session_token(str(user.id), user.email),
    }


@app.get("/activate-otp")
def _activate_otp(x_token: Annotated[str | None, Header()] = None):
    otp_uri = get_otp_uri(x_token)
    return {"message": "OTP url generated successfully", "otp_uri": otp_uri}


@app.get("/activate-token/{otp_code}")
def _activate_token(
    otp_code: str, x_token: Annotated[str | None, Header()] = None
) -> dict:
    active_token = activate_token(x_token, otp_code)
    return {
        "message": "User logged in successfully",
        "token": active_token,
    }


@app.get("/logout")
def _logout(x_token: Annotated[str | None, Header()] = None):
    return {"message": "User logout successfully"}


@app.get("/test-endpoint")
def _test_endpoint(x_token: Annotated[str | None, Header()] = None):
    token = extract_token(x_token)
    if not token.active:
        raise ValueError("Token is not active")
    return {"message": "Token is active"}

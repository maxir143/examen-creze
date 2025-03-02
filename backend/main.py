from contextlib import asynccontextmanager
import uuid
from fastapi import FastAPI, Request
from peewee import IntegrityError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from functions.register import register_user
from config import Settings
from repository.db import init_db, get_db


# lifespan
@asynccontextmanager
async def lifespan(_app):
    # On startup
    init_db(DB_CONNECTION)
    yield
    # On shutdown


# init project
settings = Settings()
app = FastAPI(lifespan=lifespan)

# adapters
DB_CONNECTION = get_db(settings.DATABASE_NAME)


# middleware
@app.middleware("http")
async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"operation": str(uuid.uuid4()), "error:": str(e)},
        )

    return response


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


@app.post("/register")
def register(request: _BasicAuth):
    new_user = register_user(email=request.email, password=request.password)
    return {"message": f"User registered successfully with email: {new_user.email}"}


@app.post("/login")
def login(request: _BasicAuth):
    new_user = login_user(email=request.email, password=request.password)
    return {"message": "User logged in successfully"}


# /verify-totp
@app.get("/verify-totp/{token}")
def verify_totp(token: str):
    return {"message": "User verified successfully"}


@app.get("/logout")
def logout():
    return {"message": "User logout successfully"}

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from passlib.hash import pbkdf2_sha256
from models.common import TokenPayload
from models.response import SuccessResponse
from repository.users import (
    create_login_attempt,
    delete_login_attempts,
    get_login_attempts,
    get_user,
)
from utils.token import session_token
from models.auth import BasicAuth

login_router = APIRouter(prefix="/login")


class _Request(BasicAuth):
    pass


class _Response(SuccessResponse):
    data: TokenPayload


@login_router.post("", response_model=_Response)
def _user_login(request: _Request):
    user = get_user(request.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.account_locked_until:
        if datetime.fromisoformat(user.account_locked_until) >= datetime.now(
            tz=timezone.utc
        ):
            raise HTTPException(
                status_code=403,
                detail=f"User account is locked until: {user.account_locked_until} UTC",
            )

        user.account_locked_until = None
        user.save()
        delete_login_attempts(user.email)

    failed_attepts = get_login_attempts(request.email, 60)

    if failed_attepts >= 5:
        user.account_locked_until = datetime.now(tz=timezone.utc) + timedelta(hours=1)
        user.save()
        raise HTTPException(status_code=403, detail="User has been locked for 1 hour")

    password_valid = pbkdf2_sha256.verify(request.password, user.password_hash)

    if not password_valid:
        create_login_attempt(request.email, request.password)
        raise HTTPException(
            status_code=401,
            detail=f"Password is not valid, {5 - failed_attepts} attempts left",
        )

    delete_login_attempts(user.email)

    token = session_token(str(user.id), user.email)

    return _Response(
        message="User logged in successfully", data=TokenPayload(token=token)
    )

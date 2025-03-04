from datetime import datetime, timezone
from typing import Annotated
from fastapi import APIRouter, HTTPException, Header
from models.common import TokenPayload
from models.response import SuccessResponse
from repository.users import (
    get_user,
    register_token,
)
from utils.token import extract_token, session_token


refresh_router = APIRouter(prefix="/refresh")


class _Response(SuccessResponse):
    data: TokenPayload


@refresh_router.get("", response_model=_Response)
def _token_refresh(x_token: Annotated[str | None, Header()] = None):
    try:
        token = extract_token(x_token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token is not valid")

    if not token.active:
        raise HTTPException(status_code=403, detail="Token is not active")

    if token.refresh_exp < datetime.now(tz=timezone.utc).timestamp():
        raise HTTPException(status_code=403, detail="Token is expired")

    user = get_user(token.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(user.token_id, token.id)

    if str(user.token_id) != str(token.id):
        raise HTTPException(status_code=403, detail="Token is not valid anymore")

    new_token = session_token(str(user.id), user.email, active=True)
    new_token_object = extract_token(new_token)
    register_token(new_token_object.email, new_token_object.id)

    return SuccessResponse(
        message="Token refreshed successfully", data=TokenPayload(token=new_token)
    )

from typing import Annotated
from fastapi import APIRouter, HTTPException, Header
from models.response import SuccessResponse
from repository.users import (
    get_user,
    remove_token,
)
from utils.token import extract_token


log_out_router = APIRouter(prefix="/log-out")


class _Response(SuccessResponse):
    pass


@log_out_router.get("", response_model=_Response, response_model_exclude_none=True)
def _user_log_out(x_token: Annotated[str | None, Header()] = None):
    token = extract_token(x_token)
    user = get_user(token.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if str(user.token_id) != str(token.id):
        raise HTTPException(
            status_code=403, detail="Token is not valid, please login again"
        )
    remove_token(token.email)
    return _Response(message="User logout successfully")

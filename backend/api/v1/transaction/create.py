from typing import Annotated
from fastapi import APIRouter, Header
from models.response import SuccessResponse
from repository.users import (
    get_user,
)
from utils.token import extract_token

create_router = APIRouter(prefix="/create")


class _Response(SuccessResponse):
    pass


@create_router.get("", response_model=_Response, response_model_exclude_none=True)
def _test_transaction(x_token: Annotated[str | None, Header()] = None):
    token = extract_token(x_token)
    user = get_user(token.email)
    if not user:
        raise ValueError("User not found")
    if str(user.token_id) != str(token.id):
        raise ValueError("Token is not valid, please login again")
    return _Response(message="Transaction done successfully")

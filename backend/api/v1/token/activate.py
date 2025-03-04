from typing import Annotated
from fastapi import APIRouter, Header
from models.common import TokenPayload
from models.response import SuccessResponse
from repository.users import (
    register_token,
)
from utils.token import activate_token, extract_token


activate_router = APIRouter(prefix="/activate")


class _Response(SuccessResponse):
    data: TokenPayload


@activate_router.get("/{otp_code}", response_model=_Response)
def _token_activate(
    otp_code: str, x_token: Annotated[str | None, Header()] = None
) -> dict:
    active_token = activate_token(x_token, otp_code)
    token_object = extract_token(active_token)
    register_token(token_object.email, token_object.id)
    return _Response(
        message="Token activated successfully", data=TokenPayload(token=active_token)
    )

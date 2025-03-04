from typing import Annotated
from fastapi import APIRouter, Header
from models.common import TokenPayload
from models.response import SuccessResponse
from utils.token import get_otp_uri

sync_router = APIRouter(prefix="/sync")


class _Response(SuccessResponse):
    data: TokenPayload


@sync_router.get("", response_model=_Response)
def _otp_sync(x_token: Annotated[str | None, Header()] = None):
    otp_uri = get_otp_uri(x_token)
    return SuccessResponse(
        message="OTP url generated successfully", data=TokenPayload(otp_uri=otp_uri)
    )

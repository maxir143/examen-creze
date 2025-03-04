from fastapi import APIRouter, HTTPException
from models.auth import BasicAuth
from models.response import SuccessResponse
from repository.users import create_user

sign_up_router = APIRouter(prefix="/sign-up")


class _Request(BasicAuth):
    pass


class _Response(SuccessResponse):
    pass


@sign_up_router.post(
    "",
    response_model=_Response,
    response_model_exclude_none=True,
)
def _user_sign_up(request: _Request):
    if not create_user(email=request.email, password=request.password):
        raise HTTPException(status_code=400, detail="User cant be created")
    return SuccessResponse(
        message=f"User registered successfully with email: {request.email}"
    )

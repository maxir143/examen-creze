from fastapi.responses import JSONResponse
from fastapi import HTTPException, Request
from jose import JWTError
from pydantic import ValidationError
from models.response import ErrorResponse


class _ErrorResponse(JSONResponse):

    def __init__(self, error: str, status_code: int = 400, headers=None):
        self.error = str(error)
        self.status_code = status_code

        super().__init__(
            content=ErrorResponse(error=error).model_dump(),
            status_code=status_code,
            headers=headers,
        )


async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
    except JWTError as e:
        return _ErrorResponse(error="Invalid token", status_code=401)
    except Exception as e:
        return _ErrorResponse(error=str(e), status_code=500)

    return response


def ValidationError_handler(_: Request, e: ValidationError):
    response_details = {error.get("loc"): error.get("msg") for error in e.errors()}
    return _ErrorResponse(error=str(response_details), status_code=400)


def HTTPException_handler(_: Request, e: HTTPException):
    return _ErrorResponse(error=e.detail, status_code=e.status_code, headers=e.headers)

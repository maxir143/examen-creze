import uuid
from fastapi.responses import JSONResponse
from fastapi import Request
from jose import JWTError


class _ErrorResponse(JSONResponse):

    def __init__(
        self, error: str, operation: str = str(uuid.uuid4()), status_code: int = 400
    ):
        self.error = str(error)
        self.operation = str(operation)
        self.status_code = status_code

        super().__init__(
            content={"error": error, "operation": operation}, status_code=status_code
        )


async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
    except JWTError as e:
        return _ErrorResponse(error="Token is not valid")
    except Exception as e:
        return _ErrorResponse(error=str(e))

    return response

from typing import Optional
import uuid
from pydantic import BaseModel, Field
from models.annotated import StrUUID


class _BaseResponse(BaseModel):
    operation: StrUUID = Field(default_factory=uuid.uuid4)


class ErrorResponse(_BaseResponse):
    error: str = Field(description="Error message")


class SuccessResponse(_BaseResponse):
    message: str = Field(default="Success operation", description="Operation details")
    data: Optional[dict] = Field(None, description="Operation data")

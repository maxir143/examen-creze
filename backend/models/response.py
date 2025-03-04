from typing import Optional, Union
import uuid
from pydantic import BaseModel, Field
from models.annotated import StrUUID


class _BaseResponse(BaseModel):
    operation: StrUUID = Field(default_factory=uuid.uuid4)


class ErrorResponse(_BaseResponse):
    error: str = Field(
        description="Description of the error",
        examples=["This error occurred because..."],
    )


class SuccessResponse(_BaseResponse):
    message: str = Field("Success operation", description="Operation details")
    data: Optional[Union[dict, BaseModel]] = Field(None, description="Operation data")

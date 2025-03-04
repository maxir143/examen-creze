from pydantic import BaseModel, Field
from models.common import TokenPayload


class BasicAuth(BaseModel):
    email: str = Field(
        description="Email address must be valid",
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        examples=["0BjL7@example.com"],
    )
    password: str = Field(
        description="Password must be at least 8 characters long",
        min_length=8,
        examples=["12345678"],
    )


class TokenAuth(TokenPayload):
    pass

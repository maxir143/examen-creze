from datetime import datetime, timezone, timedelta
from typing import Optional
from pydantic import BaseModel
from jose import jwt
from config import Settings
import pyotp


class _Token(BaseModel):
    sub: str
    email: str
    iat: float
    exp: float
    active: bool
    otp_uri: Optional[str] = None


settings = Settings()


def session_token(
    user_id: str, email: str, expiration_minutes: int = 60 * 60, active: bool = False
) -> str:
    created_at = datetime.now(timezone.utc)
    expires_at = created_at + timedelta(minutes=expiration_minutes)

    token = _Token(
        sub=user_id,
        email=email,
        iat=created_at.timestamp(),
        exp=expires_at.timestamp(),
        active=active,
    )
    return jwt.encode(token.model_dump(), settings.TOKEN_SECRET_KEY, algorithm="HS256")


def extract_token(token_string: str) -> _Token:
    token = jwt.decode(token_string, settings.TOKEN_SECRET_KEY, algorithms=["HS256"])
    return _Token(**token)


def activate_token(token_string: str, otp: str) -> str:
    token = extract_token(token_string)
    otp_instance = pyotp.TOTP(settings.OTP_SECRET_KEY)

    if not otp_instance.verify(otp):
        raise ValueError("OTP is not valid")

    token.active = True

    return jwt.encode(token.model_dump(), settings.TOKEN_SECRET_KEY, algorithm="HS256")


def get_otp_uri(token_string: str) -> str:
    token = extract_token(token_string)

    otp_instance = pyotp.TOTP(settings.OTP_SECRET_KEY)

    return otp_instance.provisioning_uri(
        name=token.email, issuer_name=settings.OTP_ISSUER_NAME
    )

from uuid import uuid4
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from jose import jwt
import pyotp
from config import Settings
from models.annotated import StrUUID


class _Token(BaseModel):
    sub: str
    email: str
    iat: float
    exp: float
    refresh_exp: float
    active: bool
    id: StrUUID


settings = Settings()


def session_token(
    user_id: str,
    email: str,
    active: bool = False,
) -> str:
    created_at = datetime.now(timezone.utc)
    expires_at = created_at + timedelta(minutes=settings.TOKEN_EXPIRATION_MINUTES)
    refresh_expires_at = created_at + timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRATION_MINUTES
    )
    token_id = uuid4()

    token = _Token(
        id=token_id,
        sub=user_id,
        email=email,
        iat=created_at.timestamp(),
        exp=expires_at.timestamp(),
        refresh_exp=refresh_expires_at.timestamp(),
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

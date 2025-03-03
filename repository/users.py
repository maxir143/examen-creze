from datetime import datetime, timedelta, timezone
from typing import Optional
from repository.schemas.user import UserSchema
from repository.schemas.login import LoginSchema
from passlib.hash import pbkdf2_sha256


def create_user(email: str, password: str) -> bool:
    password_hash = pbkdf2_sha256.hash(password)
    new_user = UserSchema.create(email=email, password_hash=password_hash)
    return bool(new_user)


def get_user(email: str) -> Optional[UserSchema]:
    try:
        return UserSchema.get(email=email)
    except Exception:
        return None


def get_login_record(email: str, success: bool, from_minutes_ago: int) -> Optional[int]:
    from_date = datetime.now(tz=timezone.utc) - timedelta(minutes=from_minutes_ago)
    try:
        return (
            LoginSchema.select()
            .where(
                LoginSchema.created_at > from_date,
                LoginSchema.email == email,
                LoginSchema.successful == success,
            )
            .count()
        )
    except Exception as e:
        print("Login record not found", e)
        return None


def create_login_record(email: str, password: str, successful: bool) -> bool:
    password_hash = pbkdf2_sha256.hash(password)
    record = LoginSchema.create(
        email=email, password_hash=password_hash, successful=successful
    )
    return bool(record)

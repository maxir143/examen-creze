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


def register_token(email: str, token_id: str):
    user = get_user(email)
    if not user:
        raise ValueError("User not found")
    user.token_id = token_id
    user.save()


def create_login_attempt(email: str, password: str) -> bool:
    password_hash = pbkdf2_sha256.hash(password)
    record = LoginSchema.create(email=email, password_hash=password_hash)
    return bool(record)


def delete_login_attempts(email: str) -> bool:
    try:
        LoginSchema.delete().where(LoginSchema.email == email).execute()
        return True
    except Exception:
        return False


def get_login_attempts(email: str, from_minutes_ago: int) -> Optional[int]:
    from_date = datetime.now(tz=timezone.utc) - timedelta(minutes=from_minutes_ago)
    try:
        return (
            LoginSchema.select()
            .where(LoginSchema.created_at > from_date, LoginSchema.email == email)
            .count()
        )
    except Exception as e:
        print("Login record not found", e)
        return None

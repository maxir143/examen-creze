from pydantic import BaseModel
from repository.users import create_user
from passlib.hash import pbkdf2_sha256


class _RegisterUser(BaseModel):
    email: str


def register_user(email: str, password: str) -> _RegisterUser:

    password_hash = pbkdf2_sha256.hash(password)

    if not create_user(email=email, password_hash=password_hash):
        raise ValueError("User cant be created")

    return _RegisterUser(email=email)

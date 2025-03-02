from repository.schemas.user import UserSchema


def create_user(email: str, password_hash: str) -> bool:
    new_user = UserSchema.create(email=email, password_hash=password_hash)
    return bool(new_user)

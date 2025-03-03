import datetime
from datetime import datetime, timezone
import uuid
from peewee import (
    Model,
    CharField,
    DateTimeField,
    BooleanField,
    ForeignKeyField,
    UUIDField,
)
from repository.schemas.user import UserSchema
from config import Settings
from peewee import SqliteDatabase

settings = Settings()


class LoginSchema(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    email = ForeignKeyField(UserSchema, backref="login_records")
    password_hash = CharField()
    successful = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.now(tz=timezone.utc))

    class Meta:
        table_name = "login_records"
        database = SqliteDatabase(settings.DATABASE_NAME)

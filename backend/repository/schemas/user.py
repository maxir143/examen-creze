from datetime import datetime, timezone
import uuid
from peewee import Model, CharField, DateTimeField, UUIDField
from config import Settings
from peewee import SqliteDatabase

settings = Settings()


class UserSchema(Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    email = CharField(unique=True)
    password_hash = CharField()
    account_locked_until = DateTimeField(null=True)
    token_id = UUIDField()
    created_at = DateTimeField(default=datetime.now(tz=timezone.utc))

    class Meta:
        table_name = "users"
        database = SqliteDatabase(settings.DATABASE_NAME)

from peewee import Model, CharField, DateTimeField, BooleanField, ForeignKeyField
from repository.schemas.user import UserSchema
from config import Settings
from peewee import SqliteDatabase

settings = Settings()


class LoginSchema(Model):
    id = CharField(primary_key=True)
    email = ForeignKeyField(UserSchema, backref="login_records")
    password_hash = CharField()
    successful = BooleanField(default=False)
    created_at = DateTimeField()

    class Meta:
        table_name = "login_records"
        database = SqliteDatabase(settings.DATABASE_NAME)

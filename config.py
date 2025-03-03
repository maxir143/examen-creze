from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DATABASE_NAME: str
    TOKEN_SECRET_KEY: str
    OTP_SECRET_KEY: str
    OTP_ISSUER_NAME: str

    model_config = SettingsConfigDict(env_file=".env")

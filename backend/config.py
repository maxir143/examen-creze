from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DATABASE_NAME: str

    model_config = SettingsConfigDict(env_file=".env")

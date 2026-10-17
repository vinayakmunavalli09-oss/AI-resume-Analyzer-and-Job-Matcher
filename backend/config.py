"""
Application settings loaded from environment variables via pydantic-settings.
All secrets must be set via .env file or environment — never hardcoded here.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # NVIDIA NIM
    nvidia_api_key: str = ""
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_model: str = "nvidia/nemotron-3.5-lightning-30b-a3b"

    # Supabase
    supabase_url: str = ""
    supabase_secret_key: str = ""

    # App
    backend_cors_origins: str = "http://localhost:3000"
    max_file_size_mb: int = 5
    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Return cached Settings singleton."""
    return Settings()

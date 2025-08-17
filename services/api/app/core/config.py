"""
Application configuration using Pydantic settings.
"""
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Accompli API"
    VERSION: str = "0.1.0"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./accompli.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # S3 Storage
    S3_ENDPOINT: Optional[str] = None
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = "accompli-files"
    S3_REGION: str = "us-east-1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:19006"]
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Security
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    
    # Sentry
    SENTRY_DSN: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

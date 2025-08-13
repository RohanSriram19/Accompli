"""
Logging configuration for the application.
"""
import logging
import sys
from typing import Any, Dict

from app.core.config import settings


def setup_logging() -> None:
    """Setup application logging."""
    logging_config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            },
            "json": {
                "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
                "class": "pythonjsonlogger.jsonlogger.JsonFormatter" if settings.ENVIRONMENT == "production" else "logging.Formatter",
            },
        },
        "handlers": {
            "default": {
                "formatter": "json" if settings.ENVIRONMENT == "production" else "default",
                "class": "logging.StreamHandler",
                "stream": sys.stdout,
            },
        },
        "root": {
            "level": "INFO" if settings.ENVIRONMENT == "production" else "DEBUG",
            "handlers": ["default"],
        },
        "loggers": {
            "uvicorn": {
                "level": "INFO",
                "handlers": ["default"],
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "level": "WARN",
                "handlers": ["default"],
                "propagate": False,
            },
        },
    }
    
    logging.config.dictConfig(logging_config)

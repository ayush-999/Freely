from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import URL

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Freely")
    API_PREFIX: str = os.getenv("API_V1_PREFIX", "/api")
    DB_DRIVER: str = os.getenv("DB_DRIVER", "mysql").lower()
    DB_SERVER: str = os.getenv("DB_SERVER", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_NAME: str = os.getenv("DB_NAME", "freely")
    DB_USERNAME: str = os.getenv("DB_USERNAME", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret-key")
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

    @property
    def database_url(self) -> str | URL:
        if self.DB_DRIVER not in {"mysql", "mysql+pymysql"}:
            raise ValueError("Unsupported DB driver. Use mysql.")

        return URL.create(
            "mysql+pymysql",
            username=self.DB_USERNAME,
            password=self.DB_PASSWORD,
            host=self.DB_SERVER,
            port=self.DB_PORT,
            database=self.DB_NAME,
            query={"charset": "utf8mb4"},
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()

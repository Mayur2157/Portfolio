"""
Module: app.core.config
Purpose: Typed application settings, read from environment variables and an optional .env file.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import EmailStr, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    """All runtime configuration. Field names map to upper-case environment variables."""

    model_config = SettingsConfigDict(
        env_file=(REPO_DIR / ".env", BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = "INFO"
    # Built React app. When it doesn't exist (local dev with Vite), the backend serves the API only.
    static_dir: Path = REPO_DIR / "frontend" / "dist"
    enable_docs: bool = False

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: SecretStr = SecretStr("")
    smtp_sender: str = ""  # Falls back to smtp_username.
    contact_email: EmailStr = "mayurgadekar2501@gmail.com"

    # Header carrying the visitor's IP, set by an edge proxy that overwrites it (e.g. "cf-connecting-ip"
    # behind Cloudflare/Render). Empty means use the connection address. Never name a header that
    # clients can set freely, such as x-forwarded-for on a proxy that only appends to it.
    client_ip_header: str = ""
    contact_rate_limit: int = 5
    contact_rate_window_seconds: int = 60 * 60
    max_request_bytes: int = 32 * 1024

    github_username: str = "Mayur2157"
    github_token: SecretStr | None = None
    github_cache_seconds: int = 60 * 60
    github_retry_seconds: int = 5 * 60


@lru_cache
def get_settings() -> Settings:
    return Settings()

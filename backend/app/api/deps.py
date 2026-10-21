"""
Module: app.api.deps
Purpose: Dependency providers. Long-lived objects are created in the app lifespan and kept on app.state.
"""

from __future__ import annotations

from urllib.parse import urlsplit

from fastapi import Depends, Request

from app.core.config import Settings
from app.core.errors import CrossOriginError
from app.core.rate_limit import RateLimiter
from app.services.contact import ContactService
from app.services.email import EmailService
from app.services.github import GitHubService


def get_app_settings(request: Request) -> Settings:
    settings: Settings = request.app.state.settings
    return settings


def get_rate_limiter(request: Request) -> RateLimiter:
    limiter: RateLimiter = request.app.state.rate_limiter
    return limiter


def get_github_service(request: Request) -> GitHubService:
    service: GitHubService = request.app.state.github
    return service


def get_email_service(settings: Settings = Depends(get_app_settings)) -> EmailService:
    return EmailService(settings)


def get_contact_service(
    email: EmailService = Depends(get_email_service),
    limiter: RateLimiter = Depends(get_rate_limiter),
) -> ContactService:
    return ContactService(email=email, limiter=limiter)


def get_client_ip(request: Request, settings: Settings = Depends(get_app_settings)) -> str:
    """The visitor's IP, used as the rate-limit key."""
    if settings.client_ip_header:
        forwarded = request.headers.get(settings.client_ip_header, "").strip()
        if forwarded:
            return forwarded
    return request.client.host if request.client else "unknown"


def require_same_origin(request: Request) -> None:
    """Refuse requests a browser reports as coming from another site."""
    source = request.headers.get("origin") or request.headers.get("referer")
    if not source:
        return  # Non-browser clients send neither header; the rate limit still applies.
    if urlsplit(source).netloc != request.headers.get("host"):
        raise CrossOriginError

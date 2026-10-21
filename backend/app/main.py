"""
Module: app.main
Purpose: FastAPI application factory. Serves the JSON API under /api/v1 and the built React app at /.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator, Mapping
from contextlib import asynccontextmanager
from typing import Any

import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routers import contact, github, health
from app.core.config import Settings, get_settings
from app.core.errors import AppError, NotFoundError
from app.core.rate_limit import RateLimiter
from app.core.security import SecurityHeadersMiddleware
from app.models.common import ErrorResponse
from app.services.github import GitHubService

logger = logging.getLogger(__name__)

API_PREFIX = "/api/v1"
GITHUB_TIMEOUT_SECONDS = 10.0


def _field_error(field: str, error: Mapping[str, Any]) -> str:
    """Turn one Pydantic error into a message a visitor can act on."""
    kind = error.get("type")
    if kind in {"missing", "string_too_short"}:
        return f"Please enter your {field}."
    if kind == "string_too_long":
        limit = (error.get("ctx") or {}).get("max_length")
        return f"Please keep your {field} under {limit} characters."
    if field == "email":
        return "Please enter a valid email address, like name@example.com."
    if kind == "value_error":
        return str(error.get("msg", "")).removeprefix("Value error, ")
    return f"Please check your {field}."


def _register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            ErrorResponse(message=exc.public_message).model_dump(exclude_none=True), exc.status_code
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
        errors: dict[str, str] = {}
        for error in exc.errors():
            loc = error.get("loc", ())
            field = str(loc[-1]) if loc else "body"
            errors.setdefault(field, _field_error(field, error))
        body = ErrorResponse(message="Please fix the highlighted fields and try again.", errors=errors)
        return JSONResponse(body.model_dump(), status_code=422)

    @app.exception_handler(StarletteHTTPException)
    async def http_error(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        # Framework errors (404, 405) carry generic text only, never internals.
        return JSONResponse(
            ErrorResponse(message=str(exc.detail)).model_dump(exclude_none=True), exc.status_code
        )

    @app.exception_handler(Exception)
    async def unhandled_error(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled error on %s %s", request.method, request.url.path, exc_info=exc)
        return JSONResponse(ErrorResponse(message=AppError.public_message).model_dump(exclude_none=True), 500)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    logging.basicConfig(level=settings.log_level.upper())
    serve_site = (settings.static_dir / "index.html").is_file()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        app.state.http = httpx.AsyncClient(
            timeout=GITHUB_TIMEOUT_SECONDS, headers={"User-Agent": "portfolio-backend"}
        )
        app.state.github = GitHubService(app.state.http, settings)
        logger.info("Portfolio backend started (static site: %s)", "on" if serve_site else "off")
        yield
        await app.state.http.aclose()
        logger.info("Portfolio backend stopped")

    docs = settings.enable_docs
    app = FastAPI(
        title="Portfolio API",
        version="2.0.0",
        lifespan=lifespan,
        docs_url=f"{API_PREFIX}/docs" if docs else None,
        redoc_url=None,
        openapi_url=f"{API_PREFIX}/openapi.json" if docs else None,
    )
    app.state.settings = settings
    app.state.rate_limiter = RateLimiter(settings.contact_rate_limit, settings.contact_rate_window_seconds)
    app.add_middleware(SecurityHeadersMiddleware, max_request_bytes=settings.max_request_bytes)
    _register_error_handlers(app)

    for router in (health.router, contact.router, github.router):
        app.include_router(router, prefix=API_PREFIX)

    @app.api_route(
        "/api/{path:path}",
        methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        include_in_schema=False,
        response_model=ErrorResponse,
    )
    async def api_not_found(path: str) -> ErrorResponse:
        """Unknown API paths get a JSON 404 instead of the site's HTML 404 page."""
        raise NotFoundError

    if serve_site:
        # html=True serves index.html at / and 404.html (with status 404) for unknown paths.
        app.mount("/", StaticFiles(directory=settings.static_dir, html=True), name="site")

    return app


app = create_app()

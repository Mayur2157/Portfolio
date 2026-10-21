"""
Module: app.core.errors
Purpose: Domain exceptions. Each carries the status code and the safe message shown to clients.
"""

from __future__ import annotations


class AppError(Exception):
    """Base for all domain errors in this project."""

    status_code = 500
    public_message = "Something went wrong. Please try again later."


class NotFoundError(AppError):
    status_code = 404
    public_message = "Not found."


class CrossOriginError(AppError):
    status_code = 403
    public_message = "Please use the contact form on this website."


class RateLimitedError(AppError):
    status_code = 429
    public_message = (
        "You've sent several messages recently. Please try again in an hour, or email me directly."
    )


class UpstreamUnavailableError(AppError):
    status_code = 503
    public_message = (
        "Sorry, your message couldn't be sent right now. Please try again later, or email me directly."
    )

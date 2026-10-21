from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.deps import get_client_ip, get_contact_service, require_same_origin
from app.models.common import ErrorResponse, MessageResponse
from app.models.contact import ContactRequest
from app.services.contact import ContactService

router = APIRouter(tags=["contact"])

THANKS = "Thank you for your message! I'll get back to you soon."


@router.post(
    "/contact",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=MessageResponse,
    dependencies=[Depends(require_same_origin)],
    responses={
        403: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)
async def submit_contact(
    contact: ContactRequest,
    client_ip: str = Depends(get_client_ip),
    service: ContactService = Depends(get_contact_service),
) -> MessageResponse:
    """Send a contact-form message to the site owner."""
    await service.submit(contact, client_ip)
    return MessageResponse(message=THANKS)

"""API self-check. Run from backend/: python -m tests.test_api   (pytest also collects it)"""

from __future__ import annotations

import tempfile
from collections.abc import Callable
from pathlib import Path

import httpx
from fastapi.testclient import TestClient

from app.api.deps import get_email_service
from app.core.config import Settings
from app.core.errors import UpstreamUnavailableError
from app.main import create_app
from app.models.contact import ContactRequest
from app.services.github import GitHubService

VALID = {"name": "Asha", "email": "asha@example.com", "subject": "Hello", "message": "Hi there"}
RATE_LIMIT = 3


class FakeEmail:
    def __init__(self, fail: bool = False) -> None:
        self.sent: list[ContactRequest] = []
        self.fail = fail

    async def send_contact(self, contact: ContactRequest) -> None:
        if self.fail:
            raise UpstreamUnavailableError
        self.sent.append(contact)


def make_client(
    static_dir: Path | None = None, email: FakeEmail | None = None, base_url: str = "http://testserver"
) -> tuple[TestClient, FakeEmail]:
    settings = Settings(
        _env_file=None,
        static_dir=static_dir or Path("does-not-exist"),
        contact_rate_limit=RATE_LIMIT,
        smtp_username="owner@example.com",
    )
    app = create_app(settings)
    fake = email or FakeEmail()
    app.dependency_overrides[get_email_service] = lambda: fake
    return TestClient(app, base_url=base_url), fake


def test_health() -> None:
    client, _ = make_client()
    with client:
        response = client.get("/api/v1/health")
    assert response.status_code == 200 and response.json() == {"status": "ok"}
    assert response.headers["Cache-Control"] == "no-store"
    csp = response.headers["Content-Security-Policy"]
    assert "default-src 'self'" in csp and "unsafe-inline" not in csp


def test_contact_accepts_valid_message() -> None:
    client, email = make_client()
    with client:
        response = client.post("/api/v1/contact", json=VALID, headers={"Origin": "http://testserver"})
    assert response.status_code == 202, response.text
    assert len(email.sent) == 1 and email.sent[0].email == VALID["email"]


def test_contact_reports_each_invalid_field() -> None:
    client, email = make_client()
    bad = {**VALID, "email": "not-an-email", "subject": "", "message": "x" * 5001}
    with client:
        response = client.post("/api/v1/contact", json=bad)
        crlf = client.post("/api/v1/contact", json={**VALID, "subject": "Hi\r\nBcc: victim@example.com"})
    assert response.status_code == 422
    errors = response.json()["errors"]
    assert set(errors) == {"email", "subject", "message"}, errors
    assert errors["message"] == "Please keep your message under 5000 characters."
    assert (
        crlf.status_code == 422
        and crlf.json()["errors"]["subject"] == "Please keep the subject on a single line."
    )
    assert not email.sent


def test_contact_refuses_cross_origin() -> None:
    client, email = make_client()
    with client:
        response = client.post("/api/v1/contact", json=VALID, headers={"Origin": "https://evil.example"})
    assert response.status_code == 403 and not email.sent


def test_contact_honeypot_discards_silently() -> None:
    client, email = make_client()
    with client:
        response = client.post("/api/v1/contact", json={**VALID, "website": "http://spam.example"})
    assert response.status_code == 202 and not email.sent


def test_contact_rate_limit() -> None:
    client, email = make_client()
    with client:
        statuses = [client.post("/api/v1/contact", json=VALID).status_code for _ in range(RATE_LIMIT + 1)]
    assert statuses == [202] * RATE_LIMIT + [429], statuses
    assert len(email.sent) == RATE_LIMIT


def test_rate_limit_uses_configured_client_ip_header() -> None:
    client, email = make_client()
    client.app.state.settings.client_ip_header = "cf-connecting-ip"  # type: ignore[attr-defined]
    with client:
        for _ in range(RATE_LIMIT):
            post = client.post("/api/v1/contact", json=VALID, headers={"CF-Connecting-IP": "203.0.113.7"})
            assert post.status_code == 202
        # Spoofing X-Forwarded-For doesn't reset the visitor's bucket...
        spoofed = client.post(
            "/api/v1/contact",
            json=VALID,
            headers={"CF-Connecting-IP": "203.0.113.7", "X-Forwarded-For": "198.51.100.1"},
        )
        # ...while a genuinely different visitor still gets through.
        other = client.post("/api/v1/contact", json=VALID, headers={"CF-Connecting-IP": "203.0.113.8"})
    assert spoofed.status_code == 429
    assert other.status_code == 202
    assert len(email.sent) == RATE_LIMIT + 1


def test_contact_mail_failure_is_503_without_details() -> None:
    client, _ = make_client(email=FakeEmail(fail=True))
    with client:
        response = client.post("/api/v1/contact", json=VALID)
    assert response.status_code == 503
    assert set(response.json()) == {"message"}


def test_oversized_body_is_rejected_before_reading() -> None:
    client, email = make_client()
    with client:
        response = client.post(
            "/api/v1/contact", content=b"x" * 40_000, headers={"Content-Type": "application/json"}
        )
    assert response.status_code == 413 and not email.sent


REPOS = [
    {"name": "own", "html_url": "https://github.com/u/own", "stargazers_count": 2, "language": "Python"},
    {"name": "forked", "html_url": "https://github.com/u/forked", "stargazers_count": 9, "fork": True},
]


def install_github_mock(
    client: TestClient, handler: Callable[[httpx.Request], httpx.Response]
) -> GitHubService:
    """Swap in a GitHubService backed by a mock transport. Call inside `with client:` (after lifespan)."""
    state = client.app.state  # type: ignore[attr-defined]
    service = GitHubService(httpx.AsyncClient(transport=httpx.MockTransport(handler)), state.settings)
    state.github = service
    return service


def test_github_repos_cached_and_forks_excluded() -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        return httpx.Response(200, json=REPOS)

    client, _ = make_client()
    with client:
        install_github_mock(client, handler)
        first = client.get("/api/v1/github/repos").json()
        second = client.get("/api/v1/github/repos").json()
    expected = {
        "repos": [{"name": "own", "url": "https://github.com/u/own", "stars": 2, "language": "Python"}]
    }
    assert first == second == expected, first
    assert len(calls) == 1, "second request should be served from the cache"


def test_github_failure_serves_last_good_then_empty() -> None:
    up = [True]

    def handler(_: httpx.Request) -> httpx.Response:
        if up[0]:
            return httpx.Response(200, json=REPOS)
        raise httpx.ConnectError("offline")

    client, _ = make_client()
    with client:
        service = install_github_mock(client, handler)
        assert len(client.get("/api/v1/github/repos").json()["repos"]) == 1
        up[0] = False
        service._next_refresh = 0.0  # force a refresh attempt while GitHub is down
        stale = client.get("/api/v1/github/repos")
    assert stale.status_code == 200 and len(stale.json()["repos"]) == 1

    client, _ = make_client()
    with client:
        install_github_mock(client, handler)
        empty = client.get("/api/v1/github/repos")
    assert empty.status_code == 200 and empty.json() == {"repos": []}


def test_static_site_and_not_found_handling() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        site = Path(tmp)
        (site / "index.html").write_text("<h1>home</h1>", encoding="utf-8")
        (site / "404.html").write_text("<h1>missing</h1>", encoding="utf-8")
        (site / "assets").mkdir()
        (site / "assets" / "app-abc123.js").write_text("console.log(1)", encoding="utf-8")
        client, _ = make_client(static_dir=site, base_url="https://testserver")
        with client:
            home = client.get("/")
            asset = client.get("/assets/app-abc123.js")
            missing_page = client.get("/no-such-page")
            missing_api = client.get("/api/v1/no-such-endpoint")
    assert home.status_code == 200 and "home" in home.text
    assert home.headers["Cache-Control"] == "no-cache"
    assert "max-age=31536000" in home.headers["Strict-Transport-Security"]
    assert asset.headers["Cache-Control"] == "public, max-age=31536000, immutable"
    assert missing_page.status_code == 404 and "missing" in missing_page.text
    assert missing_api.status_code == 404 and missing_api.json() == {"message": "Not found."}


if __name__ == "__main__":
    checks = [
        (name, fn) for name, fn in sorted(globals().items()) if name.startswith("test_") and callable(fn)
    ]
    for name, check in checks:
        check()
        print(f"ok  {name}")
    print(f"All {len(checks)} checks passed.")

"""Self-check for the portfolio app. Run: python test_app.py"""
import os
from unittest import mock

import requests

import github_scraper
import routes
from app import app

client = app.test_client()
sent = []
routes.mail.send = sent.append  # never send real email from the check

VALID = {'name': 'Asha', 'email': 'asha@example.com', 'subject': 'Hello', 'message': 'Hi there'}


def post_contact(data, **headers):
    return client.post('/contact', data=data, headers=headers)


def reset():
    sent.clear()
    routes._hits.clear()


# Pages: homepage renders the real project count; unknown URLs are real 404s
page = client.get('/')
assert page.status_code == 200
assert f'<div class="stat-number">{len(routes.PROJECTS)}</div>' in page.get_data(as_text=True)
missing = client.get('/no-such-page')
assert missing.status_code == 404 and 'Page not found' in missing.get_data(as_text=True)
resume = client.get('/download-resume')
assert resume.status_code == 200 and 'Mayur Gadekar Resume.pdf' in resume.headers['Content-Disposition']
resume.close()

# Projects carry star counts merged from github_repos.json
projects = client.get('/api/projects').get_json()
assert len(projects) == len(routes.PROJECTS) and all(isinstance(p['stars'], int) for p in projects)

# Contact: a valid message is sent once, with the visitor as reply-to
reset()
assert post_contact(VALID).status_code == 200
assert len(sent) == 1 and sent[0].reply_to == VALID['email']

# Contact: each invalid field is reported against that field, and nothing is sent
reset()
bad = dict(VALID, email='not-an-email', message='x' * (routes.FIELD_LIMITS['message'] + 1), subject='')
response = post_contact(bad)
assert response.status_code == 400
assert set(response.get_json()['errors']) == {'email', 'message', 'subject'}
assert post_contact(dict(VALID, subject='Hi\r\nBcc: victim@example.com')).status_code == 400
assert not sent

# Contact: posts from another site are refused; same-site posts are accepted
reset()
assert post_contact(VALID, Origin='https://evil.example').status_code == 403
assert post_contact(VALID, Origin='http://localhost').status_code == 200
assert len(sent) == 1

# Contact: bots that fill the hidden field get a success reply but no email
reset()
assert post_contact(dict(VALID, website='http://spam.example')).status_code == 200
assert not sent

# Contact: the per-IP rate limit kicks in after RATE_LIMIT emails
reset()
for _ in range(routes.RATE_LIMIT):
    assert post_contact(VALID).status_code == 200
assert post_contact(VALID).status_code == 429
assert len(sent) == routes.RATE_LIMIT

# Contact: an SMTP failure returns a clean JSON error instead of crashing
reset()
with mock.patch.object(routes.mail, 'send', side_effect=OSError('smtp down')):
    failed = post_contact(VALID)
assert failed.status_code == 500 and failed.get_json()['success'] is False

# Scraper: a failed fetch exits non-zero and leaves github_repos.json untouched
before = open('github_repos.json', 'rb').read()
with mock.patch('requests.get', side_effect=requests.ConnectionError('offline')):
    try:
        exec(compile(open(github_scraper.__file__, encoding='utf-8').read(), github_scraper.__file__, 'exec'),
             {'__name__': '__main__', '__file__': github_scraper.__file__})
        raise AssertionError('scraper should exit on fetch failure')
    except SystemExit as exit_:
        assert exit_.code == 1
assert open('github_repos.json', 'rb').read() == before

print('All checks passed.')

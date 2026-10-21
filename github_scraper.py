"""Refresh github_repos.json, which supplies live stars and language for the projects in routes.py.

Run: python github_scraper.py   (then restart the app to pick up the new data)
"""
import json
import logging
import sys

import requests

logger = logging.getLogger(__name__)


def get_github_repositories(username: str) -> list[dict]:
    """
    Get GitHub repositories using GitHub API.
    Raises requests.RequestException if GitHub can't be reached or returns an error.
    """
    url = f"https://api.github.com/users/{username}/repos"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/vnd.github.v3+json'
    }

    # 100 is GitHub's page-size maximum. Ceiling: accounts with more than 100 repos would
    # need to follow the Link header for further pages.
    response = requests.get(url, headers=headers, params={'per_page': 100}, timeout=15)
    response.raise_for_status()

    repos_data = response.json()
    repositories = []

    for repo in repos_data:
        # Skip forked repositories
        if repo.get('fork', False):
            continue

        repo_data = {
            'name': repo['name'],
            'description': repo['description'] or 'No description available',
            'url': repo['html_url'],
            'language': repo['language'] or 'Unknown',
            'stars': repo['stargazers_count'],
            'forks': repo['forks_count'],
            'updated': repo['updated_at'],
            'created': repo['created_at'],
            'topics': repo.get('topics', [])
        }
        repositories.append(repo_data)

    # Sort by updated date (most recent first)
    repositories.sort(key=lambda x: x['updated'], reverse=True)

    return repositories


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(message)s')
    username = "Mayur2157"

    try:
        repos = get_github_repositories(username)
    except requests.RequestException:
        # Keep the existing github_repos.json rather than overwriting it with nothing.
        logger.error("Could not fetch repositories; github_repos.json left unchanged.", exc_info=True)
        sys.exit(1)

    logger.info("Found %d repositories:", len(repos))
    for repo in repos:
        logger.info("- %s: %s...", repo['name'], repo['description'][:50])
        logger.info("  Language: %s, URL: %s", repo['language'], repo['url'])

    # Save to JSON file
    with open('github_repos.json', 'w', encoding='utf-8') as f:
        json.dump(repos, f, indent=2)

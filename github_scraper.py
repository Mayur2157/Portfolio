import requests
import json
from datetime import datetime

def get_github_repositories(username):
    """
    Get GitHub repositories using GitHub API
    """
    url = f"https://api.github.com/users/{username}/repos"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    try:
        response = requests.get(url, headers=headers)
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
        
    except Exception as e:
        print(f"Error fetching GitHub repositories: {e}")
        return []

if __name__ == "__main__":
    username = "Mayur2157"
    repos = get_github_repositories(username)
    
    print(f"Found {len(repos)} repositories:")
    for repo in repos:
        print(f"- {repo['name']}: {repo['description'][:50]}...")
        print(f"  Language: {repo['language']}, URL: {repo['url']}")
        print()
    
    # Save to JSON file
    with open('github_repos.json', 'w') as f:
        json.dump(repos, f, indent=2)
import { useEffect, useState } from "react";

import { apiRequest, type RepoStats } from "../lib/api";

export type ReposState =
  | { status: "loading" }
  | { status: "ready"; repos: RepoStats[] }
  | { status: "error" };

// One request per page load, shared by every component that needs repo stats.
let pending: Promise<RepoStats[]> | null = null;

function loadRepos(): Promise<RepoStats[]> {
  pending ??= apiRequest<{ repos: RepoStats[] }>("/api/v1/github/repos").then((body) => body.repos);
  return pending;
}

export function useGithubRepos(): ReposState {
  const [state, setState] = useState<ReposState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    loadRepos().then(
      (repos) => active && setState({ status: "ready", repos }),
      () => active && setState({ status: "error" }),
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}

/** Stats for one repository URL, or undefined while loading, on error, or when unknown. */
export function findRepo(state: ReposState, url: string | undefined): RepoStats | undefined {
  if (state.status !== "ready" || !url) return undefined;
  const key = url.toLowerCase();
  return state.repos.find((repo) => repo.url.toLowerCase() === key);
}

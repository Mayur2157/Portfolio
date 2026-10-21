export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string>;
}

/** A response with a non-2xx status. Network failures and timeouts surface as other errors. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function isErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null && typeof (value as ApiErrorBody).message === "string";
}

const DEFAULT_TIMEOUT_MS = 10_000;

export async function apiRequest<T>(path: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", ...init.headers },
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(response.status, isErrorBody(body) ? body : null);
    }
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface RepoStats {
  name: string;
  url: string;
  stars: number;
  language: string | null;
}

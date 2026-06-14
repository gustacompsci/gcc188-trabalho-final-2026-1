import { env } from "./env";

const API_BASE = `${env.VITE_SERVER_URL}/api`;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpInput = string | URL | Request;
export type HttpOptions = Omit<RequestInit, "method">;

function resolveInput(input: HttpInput): HttpInput {
  if (typeof input === "string" && input.startsWith("/")) {
    return `${API_BASE}${input}`;
  }
  return input;
}

function buildInit(method: string, init: HttpOptions): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return { credentials: "include", ...init, method, headers };
}

const FALLBACK: Record<number, string> = {
  401: "Sessão expirada. Faça login novamente.",
  403: "Você não tem acesso a isso.",
  409: "Conflito: o recurso já existe.",
  422: "Dados inválidos.",
  429: "Muitas tentativas. Aguarde um momento.",
};

function fallbackMessage(status: number): string {
  return (
    FALLBACK[status] ?? (status >= 500 ? "Erro interno. Tente novamente." : "Algo deu errado.")
  );
}

async function request<T>(method: string, input: HttpInput, options?: HttpOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(resolveInput(input), buildInit(method, options ?? {}));
  } catch (cause) {
    throw new ApiError("Erro de conexão. Tente novamente.", 0, cause);
  }

  if (response.status === 204) return undefined as T;

  const isJson = response.headers.get("content-type")?.includes("application/json") ?? false;

  if (!response.ok) {
    const body = isJson ? await response.json().catch(() => null) : null;
    throw new ApiError(
      (body as { message?: string } | null)?.message ?? fallbackMessage(response.status),
      response.status,
      body,
    );
  }

  if (!isJson) return undefined as T;
  return response.json() as Promise<T>;
}

export const http = {
  get: <T = unknown>(input: HttpInput, options?: HttpOptions) => request<T>("GET", input, options),
  post: <T = unknown>(input: HttpInput, options?: HttpOptions) =>
    request<T>("POST", input, options),
  put: <T = unknown>(input: HttpInput, options?: HttpOptions) => request<T>("PUT", input, options),
  patch: <T = unknown>(input: HttpInput, options?: HttpOptions) =>
    request<T>("PATCH", input, options),
  delete: <T = unknown>(input: HttpInput, options?: HttpOptions) =>
    request<T>("DELETE", input, options),
};

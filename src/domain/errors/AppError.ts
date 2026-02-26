// Core error contract — zero external dependencies
// Lives in domain so every layer can import it without violating dependency rules

export type ErrorCode =
  | "UNAUTHORIZED"   // 401 — session expired
  | "FORBIDDEN"      // 403 — no permission
  | "NOT_FOUND"      // 404 — resource missing
  | "SERVER_ERROR"   // 500 — backend failure
  | "NETWORK_ERROR"  // fetch failed / offline
  | "UNKNOWN";       // anything else

export interface AppError {
  code: ErrorCode;
  message: string;     // user-facing text
  detail?: string;     // raw server message (dev/logging only)
  statusCode?: number;
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

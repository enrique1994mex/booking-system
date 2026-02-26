import { AppError, ErrorCode } from "@/domain/errors/AppError";

const STATUS_MAP: Record<number, { code: ErrorCode; message: string }> = {
  401: { code: "UNAUTHORIZED", message: "Your session has expired. Please sign in again." },
  403: { code: "FORBIDDEN",    message: "You don't have permission to do that." },
  404: { code: "NOT_FOUND",    message: "The requested resource was not found." },
  500: { code: "SERVER_ERROR", message: "Something went wrong on our end. Please try again." },
};

export function normalizeApiError(status: number, detail?: string): AppError {
  const entry = STATUS_MAP[status] ?? {
    code: "UNKNOWN" as ErrorCode,
    message: "An unexpected error occurred.",
  };
  return { ...entry, statusCode: status, detail };
}

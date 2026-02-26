import { AppError, isAppError } from "@/domain/errors/AppError";
import { normalizeApiError } from "./normalizeApiError";

export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw normalizeApiError(res.status, body?.message ?? body?.error);
    }

    return res.json() as Promise<T>;
  } catch (e) {
    if (isAppError(e)) throw e; // already normalized, re-throw as-is
    throw {
      code: "NETWORK_ERROR",
      message: "Unable to reach the server. Check your connection.",
    } satisfies AppError;
  }
}

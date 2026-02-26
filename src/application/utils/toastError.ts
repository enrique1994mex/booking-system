// For action errors (button clicks, mutations) — shows a non-blocking toast
// Page-level data errors should use ErrorResult instead
import { message } from "antd";
import { AppError } from "@/domain/errors/AppError";

export function toastError(error: AppError): void {
  message.error(error.message);
}

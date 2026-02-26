"use client";

import { Button, Result } from "antd";
import { AppError, ErrorCode } from "@/domain/errors/AppError";

const CONFIG: Record<ErrorCode, { status: "403" | "404" | "500" | "error"; title: string }> = {
  UNAUTHORIZED:  { status: "403",   title: "Session Expired"   },
  FORBIDDEN:     { status: "403",   title: "Access Denied"     },
  NOT_FOUND:     { status: "404",   title: "Not Found"         },
  SERVER_ERROR:  { status: "500",   title: "Server Error"      },
  NETWORK_ERROR: { status: "error", title: "Connection Error"  },
  UNKNOWN:       { status: "error", title: "Unexpected Error"  },
};

interface Props {
  error: AppError;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorResult({ error, onRetry, onBack }: Props) {
  const { status, title } = CONFIG[error.code];
  return (
    <Result
      status={status}
      title={title}
      subTitle={error.message}
      extra={[
        onRetry && <Button key="retry" type="primary" onClick={onRetry}>Try again</Button>,
        onBack  && <Button key="back"  onClick={onBack}>Go back</Button>,
      ].filter(Boolean)}
    />
  );
}

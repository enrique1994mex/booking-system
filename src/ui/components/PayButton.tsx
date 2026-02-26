"use client";

import { Button } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useState } from "react";
import { apiClient } from "@/infrastructure/http/apiClient";
import { isAppError } from "@/domain/errors/AppError";
import { toastError } from "@/application/utils/toastError";

type PaymentStage = "idle" | "creating" | "redirecting";

const stageLabels: Record<PaymentStage, string> = {
  idle: "Pay now",
  creating: "Securing payment...",
  redirecting: "Redirecting...",
};

export function PayButton({ bookingId }: { bookingId: string }) {
  const [stage, setStage] = useState<PaymentStage>("idle");

  const handlePay = async () => {
    setStage("creating");
    try {
      const { url } = await apiClient<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      setStage("redirecting");
      window.location.href = url;
    } catch (e) {
      setStage("idle");
      if (isAppError(e)) toastError(e);
    }
  };

  return (
    <Button
      type="primary"
      size="large"
      icon={<CreditCardOutlined />}
      loading={stage !== "idle"}
      onClick={handlePay}
      block
      style={{ height: 48, fontSize: 16, fontWeight: 600 }}
    >
      {stageLabels[stage]}
    </Button>
  );
}

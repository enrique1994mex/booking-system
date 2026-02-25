"use client";

import { Button } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useState } from "react";

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
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Checkout error:", error);
        throw new Error("Failed to create checkout session");
      }

      const { url } = await res.json();
      setStage("redirecting");
      window.location.href = url;
    } catch {
      setStage("idle");
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

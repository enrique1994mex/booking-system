"use client";

import { Button } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useState } from "react";

export function PayButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
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
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      size="large"
      icon={<CreditCardOutlined />}
      loading={loading}
      onClick={handlePay}
      block
      style={{ height: 48, fontSize: 16, fontWeight: 600 }}
    >
      Pay now
    </Button>
  );
}

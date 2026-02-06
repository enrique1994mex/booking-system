"use client";

export function PayButton({ bookingId }: { bookingId: string }) {
  const handlePay = async () => {
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
  };

  return <button onClick={handlePay}>Pay now</button>;
}

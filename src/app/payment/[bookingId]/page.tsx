import { notFound } from "next/navigation";
import { PayButton } from "@/ui/components/PayButton";
import "./payment.css";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { bookingId } = await params;

  if (!bookingId) {
    notFound();
  }

  return (
    <main className="payment-page">
      <div className="payment-card">
        <div className="payment-card__header">
          <h2 className="payment-card__title">Confirm your payment</h2>
          <p className="payment-card__subtitle">
            Complete your reservation securely
          </p>
        </div>

        <div className="payment-card__body">
          <div className="payment-card__booking-info">
            <span className="payment-card__booking-label">Booking ID</span>
            <span className="payment-card__booking-id">{bookingId}</span>
          </div>

          <PayButton bookingId={bookingId} />
        </div>
      </div>
    </main>
  );
}

// app/payment/[bookingId]/page.tsx
import { notFound } from "next/navigation";
import { PayButton } from "@/ui/components/PayButton";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { bookingId } = await params;
  console.log("Payment page for bookingId:", bookingId);

  // (opcional pero recomendado)
  // Aquí puedes validar que el booking exista y esté UNPAID
  // usando getSupabaseServerClient()

  if (!bookingId) {
    notFound();
  }

  return (
    <main>
      <h1>Confirm your payment</h1>
      <p>Booking ID: {bookingId}</p>

      <PayButton bookingId={bookingId} />
    </main>
  );
}

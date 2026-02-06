import { NextResponse } from "next/server";
import { processWebhookEventService } from "@/application/services/PaymentService";

export async function POST(request: Request) {
  try {
    // 1. Get raw body for signature verification
    const payload = await request.text();

    // 2. Get Stripe signature from headers
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("[Stripe Webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // 3. Process webhook event (signature verification happens in service)
    const result = await processWebhookEventService(payload, signature);

    console.log("[Stripe Webhook] Processed:", {
      action: result.action,
      bookingId: result.bookingId,
      success: result.success,
    });

    // 4. Return 200 OK to acknowledge receipt
    return NextResponse.json({
      received: true,
      action: result.action,
      bookingId: result.bookingId,
    });

  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);

    // Signature verification failed
    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // For other errors, still return 200 to prevent Stripe retries
    // Log the error for investigation
    return NextResponse.json(
      { received: true, error: "Processing failed" },
      { status: 200 }
    );
  }
}

// Disable body parsing - we need raw body for signature verification
export const dynamic = "force-dynamic";

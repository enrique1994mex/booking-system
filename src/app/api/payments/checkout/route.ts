import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/infrastructure/supabase/supabaseServerClient";
import { createCheckoutSessionService } from "@/application/services/PaymentService";
import { createSystemRepositories } from "@/infrastructure/factories/createSystemRepositories";

interface CreateCheckoutRequestBody {
  bookingId: string;
  amount: number;
  currency?: string;
  lineItemName: string;
  lineItemDescription?: string;
  metadata?: {
    accommodationName?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
  };
}

export async function POST(request: Request) {
  try {
    // 1. Validate Supabase session
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
  
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body: CreateCheckoutRequestBody = await request.json();
    const { bookingId, metadata } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    // 3. Validate booking ownership
    const { bookingRepository, paymentPersistenceRepository } = createSystemRepositories();
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: booking does not belong to user" },
        { status: 403 }
      );
    }

    const amount = booking.totalPrice;

    const lineItemName = `Booking ${booking.id}`;
    const lineItemDescription = `${booking.roomId} (${booking.dateRange.startDate} → ${booking.dateRange.endDate})`;

    // 3.5 CREATE PENDING PAYMENT (NUEVO)
    await paymentPersistenceRepository.createPendingPayment({
      bookingId: booking.id,
      userId: user.id,
      amount,
    });


    // 4. Generate idempotency key from booking + user + timestamp
    const idempotencyKey = `checkout_${bookingId}_${user.id}`;

    // 5. Build URLs
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
    const successUrl = `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`;
    const cancelUrl = `${origin}/booking/${bookingId}?cancelled=true`;
 
    // 6. Call service
    const result = await createCheckoutSessionService({
      bookingId,
      userId: user.id,
      amount: amount,
      successUrl,
      cancelUrl,
      idempotencyKey,
      lineItemName,
      lineItemDescription,
      metadata: {
        ...metadata,
        bookingId, 
        userId: user.id, 
      },
    });

    return NextResponse.json({
      sessionId: result.sessionId,
      url: result.url,
    });

  } catch (error) {
    console.error("[POST /api/payments/create] Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

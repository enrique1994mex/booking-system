import { getSupabaseClient } from "@/infrastructure/db/supabaseClient";
import { PaymentStatus } from "@/domain/entities/Payment";
import { PaymentPersistenceRepository } from "@/domain/repositories/PaymentPersistenceRepository";
import { Money } from "@/domain/value-objects/Money";

export class SupabasePaymentPersistenceRepository implements PaymentPersistenceRepository {
  private supabase = getSupabaseClient();

  async createPendingPayment(input: {
    bookingId: string;
    userId: string;
    amount: Money;
  }): Promise<void> {
    const { error } = await this.supabase
      .from("payments")
      .insert({
        booking_id: input.bookingId,
        user_id: input.userId,
        amount: Math.round(input.amount.amount * 100),
        currency: input.amount.currency,
        status: PaymentStatus.PENDING,
      });

    if (error) {
      throw new Error("Failed to create pending payment");
    }
  }

  async markSucceeded(input: {
    bookingId: string;
    stripeSessionId: string;
    stripePaymentIntentId: string;
  }): Promise<void> {
    const { data, error } = await this.supabase
      .from("payments")
      .update({
        status: PaymentStatus.SUCCEEDED,
        stripe_session_id: input.stripeSessionId,
        stripe_payment_intent_id: input.stripePaymentIntentId,
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", input.bookingId)
      .eq("status", PaymentStatus.PENDING) // 🔑 idempotencia
      .select()
      .single();

    if (error || !data) {
      throw new Error("Failed to mark payment as succeeded");
    }
  }

  async markFailed(bookingId: string): Promise<void> {
    const { error } = await this.supabase
      .from("payments")
      .update({
        status: PaymentStatus.FAILED,
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", bookingId)
      .eq("status", PaymentStatus.PENDING);

    if (error) {
      throw new Error("Failed to mark payment as failed");
    }
  }

  async findBySessionId(
    sessionId: string
  ): Promise<{ bookingId: string } | null> {
    const { data, error } = await this.supabase
      .from("payments")
      .select("booking_id")
      .eq("stripe_session_id", sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return { bookingId: data.booking_id };
  }
}

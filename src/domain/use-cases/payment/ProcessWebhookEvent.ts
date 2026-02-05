import { BookingRepository } from "../../repositories/BookingRepository";
import { PaymentRepository, WebhookEvent } from "../../repositories/PaymentRepository";

export interface ProcessWebhookResult {
  success: boolean;
  action: "booking_confirmed" | "payment_failed" | "refunded" | "ignored";
  bookingId?: string;
}

export class ProcessWebhookEvent {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly bookingRepository: BookingRepository
  ) {}

  async execute(payload: string, signature: string): Promise<ProcessWebhookResult> {
    if (!payload || !signature) {
      throw new Error("Payload and signature are required");
    }

    const event = await this.paymentRepository.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case "payment_intent.succeeded":
      case "checkout.session.completed":
        return this.handlePaymentSuccess(event);

      case "payment_intent.payment_failed":
        return this.handlePaymentFailed(event);

      case "charge.refunded":
        return this.handleRefund(event);

      default:
        return { success: true, action: "ignored" };
    }
  }

  private async handlePaymentSuccess(event: WebhookEvent): Promise<ProcessWebhookResult> {
    const bookingId = event.metadata?.bookingId;

    if (!bookingId) {
      console.warn("Payment succeeded but no bookingId in metadata");
      return { success: true, action: "ignored" };
    }

    await this.bookingRepository.updateStatus(bookingId, "CONFIRMED");

    return {
      success: true,
      action: "booking_confirmed",
      bookingId,
    };
  }

  private async handlePaymentFailed(event: WebhookEvent): Promise<ProcessWebhookResult> {
    const bookingId = event.metadata?.bookingId;

    if (!bookingId) {
      return { success: true, action: "ignored" };
    }

    await this.bookingRepository.updateStatus(bookingId, "CANCELLED");

    return {
      success: true,
      action: "payment_failed",
      bookingId,
    };
  }

  private async handleRefund(event: WebhookEvent): Promise<ProcessWebhookResult> {
    const bookingId = event.metadata?.bookingId;

    if (!bookingId) {
      return { success: true, action: "ignored" };
    }

    await this.bookingRepository.updateStatus(bookingId, "CANCELLED");

    return {
      success: true,
      action: "refunded",
      bookingId,
    };
  }
}

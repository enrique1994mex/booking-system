import { Payment, PaymentStatus, PaymentMetadata } from "@/domain/entities/Payment";
import { Money } from "@/domain/value-objects/Money";
import {
  PaymentRepository,
  CreatePaymentIntentInput,
  CreatePaymentIntentResult,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  WebhookEvent,
} from "@/domain/repositories/PaymentRepository";

const mockPayments: Map<string, Payment> = new Map();

export class MockPaymentRepository implements PaymentRepository {
  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
    const paymentIntentId = `pi_mock_${Date.now()}`;
    const clientSecret = `${paymentIntentId}_secret_mock`;

    const payment: Payment = {
      id: paymentIntentId,
      bookingId: input.metadata.bookingId,
      userId: input.metadata.userId,
      amount: input.amount,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: paymentIntentId,
      stripeSessionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPayments.set(paymentIntentId, payment);

    return {
      paymentIntentId,
      clientSecret,
      amount: Math.round(input.amount.amount * 100),
      currency: input.amount.currency,
    };
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult> {
    const sessionId = `cs_mock_${Date.now()}`;

    return {
      sessionId,
      url: `${input.successUrl}?session_id=${sessionId}`,
    };
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent> {
    // In mock mode, parse the payload directly
    const data = JSON.parse(payload);

    return {
      type: data.type ?? "payment_intent.succeeded",
      paymentIntentId: data.paymentIntentId,
      sessionId: data.sessionId,
      metadata: data.metadata as PaymentMetadata,
      amount: data.amount,
      currency: data.currency,
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Payment | null> {
    return mockPayments.get(paymentIntentId) ?? null;
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    const payment = mockPayments.get(paymentIntentId);
    if (payment) {
      payment.status = PaymentStatus.CANCELLED;
      payment.updatedAt = new Date();
    }
  }
}

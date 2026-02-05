import Stripe from "stripe";
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
import { getStripeClient, getStripeWebhookSecret } from "../stripe/stripeClient";

export class StripePaymentRepository implements PaymentRepository {
  private stripe: Stripe;

  constructor() {
    this.stripe = getStripeClient();
  }

  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
    const amountInCents = Math.round(input.amount.amount * 100);

    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: input.amount.currency.toLowerCase(),
        metadata: this.serializeMetadata(input.metadata),
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        idempotencyKey: input.idempotencyKey,
      }
    );

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to create payment intent: no client secret returned");
    }

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
      currency: input.amount.currency,
    };
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult> {
    const amountInCents = Math.round(input.amount.amount * 100);

    const session = await this.stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: this.serializeMetadata(input.metadata),
        line_items: [
          {
            price_data: {
              currency: input.amount.currency.toLowerCase(),
              product_data: {
                name: input.lineItemName,
                description: input.lineItemDescription,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          metadata: this.serializeMetadata(input.metadata),
        },
      },
      {
        idempotencyKey: input.idempotencyKey,
      }
    );

    if (!session.url) {
      throw new Error("Failed to create checkout session: no URL returned");
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent> {
    const webhookSecret = getStripeWebhookSecret();

    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    return this.mapStripeEventToWebhookEvent(event);
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Payment | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return this.mapPaymentIntentToPayment(paymentIntent);
    } catch (error) {
      if ((error as Stripe.errors.StripeError).code === "resource_missing") {
        return null;
      }
      throw error;
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    await this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  private serializeMetadata(metadata: PaymentMetadata): Record<string, string> {
    return {
      bookingId: metadata.bookingId,
      userId: metadata.userId,
      ...(metadata.accommodationName && { accommodationName: metadata.accommodationName }),
      ...(metadata.roomType && { roomType: metadata.roomType }),
      ...(metadata.checkIn && { checkIn: metadata.checkIn }),
      ...(metadata.checkOut && { checkOut: metadata.checkOut }),
    };
  }

  private parseMetadata(metadata: Stripe.Metadata | null): PaymentMetadata | undefined {
    if (!metadata || !metadata.bookingId || !metadata.userId) {
      return undefined;
    }

    return {
      bookingId: metadata.bookingId,
      userId: metadata.userId,
      accommodationName: metadata.accommodationName,
      roomType: metadata.roomType,
      checkIn: metadata.checkIn,
      checkOut: metadata.checkOut,
    };
  }

  private mapStripeEventToWebhookEvent(event: Stripe.Event): WebhookEvent {
    const result: WebhookEvent = {
      type: event.type,
    };

    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      result.paymentIntentId = paymentIntent.id;
      result.metadata = this.parseMetadata(paymentIntent.metadata);
      result.amount = paymentIntent.amount;
      result.currency = paymentIntent.currency;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      result.sessionId = session.id;
      result.paymentIntentId = session.payment_intent as string;
      result.metadata = this.parseMetadata(session.metadata);
      result.amount = session.amount_total ?? undefined;
      result.currency = session.currency ?? undefined;
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      result.paymentIntentId = charge.payment_intent as string;
      result.metadata = this.parseMetadata(charge.metadata);
      result.amount = charge.amount;
      result.currency = charge.currency;
    }

    return result;
  }

  private mapPaymentIntentToPayment(paymentIntent: Stripe.PaymentIntent): Payment {
    const metadata = this.parseMetadata(paymentIntent.metadata);

    return {
      id: paymentIntent.id,
      bookingId: metadata?.bookingId ?? "",
      userId: metadata?.userId ?? "",
      amount: new Money(paymentIntent.amount / 100, paymentIntent.currency.toUpperCase()),
      status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
      stripePaymentIntentId: paymentIntent.id,
      stripeSessionId: null,
      createdAt: new Date(paymentIntent.created * 1000),
      updatedAt: new Date(),
    };
  }

  private mapStripeStatusToPaymentStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
    switch (status) {
      case "succeeded":
        return PaymentStatus.SUCCEEDED;
      case "processing":
        return PaymentStatus.PROCESSING;
      case "canceled":
        return PaymentStatus.CANCELLED;
      case "requires_payment_method":
      case "requires_confirmation":
      case "requires_action":
      case "requires_capture":
      default:
        return PaymentStatus.PENDING;
    }
  }
}

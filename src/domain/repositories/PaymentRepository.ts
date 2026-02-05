import { Money } from "../value-objects/Money";
import { Payment, PaymentMetadata } from "../entities/Payment";

export interface CreatePaymentIntentInput {
  amount: Money;
  metadata: PaymentMetadata;
  idempotencyKey: string;
}

export interface CreatePaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface CreateCheckoutSessionInput {
  amount: Money;
  metadata: PaymentMetadata;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
  lineItemName: string;
  lineItemDescription?: string;
}

export interface CreateCheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface WebhookEvent {
  type: string;
  paymentIntentId?: string;
  sessionId?: string;
  metadata?: PaymentMetadata;
  amount?: number;
  currency?: string;
}

export interface PaymentRepository {
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult>;
  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult>;
  constructWebhookEvent(payload: string, signature: string): Promise<WebhookEvent>;
  getPaymentIntent(paymentIntentId: string): Promise<Payment | null>;
  cancelPaymentIntent(paymentIntentId: string): Promise<void>;
}

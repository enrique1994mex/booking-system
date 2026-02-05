import { Money } from "../../value-objects/Money";
import { PaymentMetadata } from "../../entities/Payment";
import { PaymentRepository, CreateCheckoutSessionResult } from "../../repositories/PaymentRepository";

export interface CreateCheckoutSessionInput {
  bookingId: string;
  userId: string;
  amount: Money;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
  lineItemName: string;
  lineItemDescription?: string;
  metadata?: Partial<PaymentMetadata>;
}

export class CreateCheckoutSession {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult> {
    if (!input.bookingId) {
      throw new Error("Booking ID is required");
    }

    if (!input.userId) {
      throw new Error("User ID is required");
    }

    if (input.amount.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    if (!input.successUrl || !input.cancelUrl) {
      throw new Error("Success and cancel URLs are required");
    }

    if (!input.idempotencyKey) {
      throw new Error("Idempotency key is required");
    }

    const metadata: PaymentMetadata = {
      bookingId: input.bookingId,
      userId: input.userId,
      ...input.metadata,
    };

    return this.paymentRepository.createCheckoutSession({
      amount: input.amount,
      metadata,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      idempotencyKey: input.idempotencyKey,
      lineItemName: input.lineItemName,
      lineItemDescription: input.lineItemDescription,
    });
  }
}

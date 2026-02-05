import { Money } from "../../value-objects/Money";
import { PaymentMetadata } from "../../entities/Payment";
import { PaymentRepository, CreatePaymentIntentResult } from "../../repositories/PaymentRepository";

export interface CreatePaymentIntentInput {
  bookingId: string;
  userId: string;
  amount: Money;
  metadata?: Partial<PaymentMetadata>;
  idempotencyKey: string;
}

export class CreatePaymentIntent {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
    if (!input.bookingId) {
      throw new Error("Booking ID is required");
    }

    if (!input.userId) {
      throw new Error("User ID is required");
    }

    if (input.amount.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    if (!input.idempotencyKey) {
      throw new Error("Idempotency key is required");
    }

    const metadata: PaymentMetadata = {
      bookingId: input.bookingId,
      userId: input.userId,
      ...input.metadata,
    };

    return this.paymentRepository.createPaymentIntent({
      amount: input.amount,
      metadata,
      idempotencyKey: input.idempotencyKey,
    });
  }
}

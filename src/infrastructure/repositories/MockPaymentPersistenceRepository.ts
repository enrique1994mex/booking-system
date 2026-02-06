import { PaymentStatus } from "@/domain/entities/Payment";
import { PaymentPersistenceRepository } from "@/domain/repositories/PaymentPersistenceRepository";
import { Money } from "@/domain/value-objects/Money";

interface MockPaymentRecord {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const mockPayments: Map<string, MockPaymentRecord> = new Map();

export class MockPaymentPersistenceRepository implements PaymentPersistenceRepository {
  async createPendingPayment(input: {
    bookingId: string;
    userId: string;
    amount: Money;
  }): Promise<void> {
    const record: MockPaymentRecord = {
      bookingId: input.bookingId,
      userId: input.userId,
      amount: Math.round(input.amount.amount * 100),
      currency: input.amount.currency,
      status: PaymentStatus.PENDING,
      stripeSessionId: null,
      stripePaymentIntentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPayments.set(input.bookingId, record);
  }

  async markSucceeded(input: {
    bookingId: string;
    stripeSessionId: string;
    stripePaymentIntentId: string;
  }): Promise<void> {
    const record = mockPayments.get(input.bookingId);

    if (!record || record.status !== PaymentStatus.PENDING) {
      throw new Error("Failed to mark payment as succeeded");
    }

    record.status = PaymentStatus.SUCCEEDED;
    record.stripeSessionId = input.stripeSessionId;
    record.stripePaymentIntentId = input.stripePaymentIntentId;
    record.updatedAt = new Date();
  }

  async markFailed(bookingId: string): Promise<void> {
    const record = mockPayments.get(bookingId);

    if (!record || record.status !== PaymentStatus.PENDING) {
      throw new Error("Failed to mark payment as failed");
    }

    record.status = PaymentStatus.FAILED;
    record.updatedAt = new Date();
  }

  async findBySessionId(sessionId: string): Promise<{ bookingId: string } | null> {
    for (const [bookingId, record] of mockPayments.entries()) {
      if (record.stripeSessionId === sessionId) {
        return { bookingId };
      }
    }

    return null;
  }
}

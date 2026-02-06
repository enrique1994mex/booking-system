import { Money } from "../value-objects/Money";

export interface PaymentPersistenceRepository {
  createPendingPayment(input: {
    bookingId: string;
    userId: string;
    amount: Money;
  }): Promise<void>;

  markSucceeded(input: {
    bookingId: string;
    stripeSessionId: string;
    stripePaymentIntentId: string;
  }): Promise<void>;

  markFailed(bookingId: string): Promise<void>;

  findBySessionId(sessionId: string): Promise<{ bookingId: string } | null>;
}

import { Money } from "../value-objects/Money";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: Money;
  status: PaymentStatus;
  stripePaymentIntentId: string | null;
  stripeSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface PaymentMetadata {
  bookingId: string;
  userId: string;
  accommodationName?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
}

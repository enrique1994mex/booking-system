import "server-only";

import { StripePaymentRepository } from "../repositories/StripePaymentRepository";
import { MockPaymentRepository } from "../repositories/MockPaymentRepository";

type PaymentMode = "stripe" | "mock";

function getPaymentMode(): PaymentMode {
  const mode = process.env.PAYMENT_MODE;
  if (mode === "mock") return "mock";
  return "stripe";
}

export function createServerRepositories() {
  const mode = getPaymentMode();

  return {
    paymentRepository:
      mode === "mock"
        ? new MockPaymentRepository()
        : new StripePaymentRepository(),
  };
}
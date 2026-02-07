import { createServerRepositories } from "@/infrastructure/factories/createServerRepositories";
import { createSystemRepositories } from "@/infrastructure/factories/createSystemRepositories";
import {
  CreatePaymentIntent,
  CreateCheckoutSession,
  ProcessWebhookEvent,
  CreatePaymentIntentInput,
  CreateCheckoutSessionInput,
  ProcessWebhookResult,
} from "@/domain/use-cases/payment";
import { CreatePaymentIntentResult, CreateCheckoutSessionResult } from "@/domain/repositories/PaymentRepository";

export async function createPaymentIntentService(
  input: CreatePaymentIntentInput
): Promise<CreatePaymentIntentResult> {
  const { paymentRepository } = createServerRepositories();
  const useCase = new CreatePaymentIntent(paymentRepository);
  return useCase.execute(input);
}

export async function createCheckoutSessionService(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const { paymentRepository } = createServerRepositories();
  const useCase = new CreateCheckoutSession(paymentRepository);
  return useCase.execute(input);
}

export async function processWebhookEventService(
  payload: string,
  signature: string
): Promise<ProcessWebhookResult> {
  const { paymentRepository } = createServerRepositories();
  const { bookingRepository, paymentPersistenceRepository } = createSystemRepositories();
  const useCase = new ProcessWebhookEvent(paymentRepository, bookingRepository, paymentPersistenceRepository);
  return useCase.execute(payload, signature);
}

export async function cancelPaymentIntentService(paymentIntentId: string): Promise<void> {
  const { paymentRepository } = createServerRepositories();
  return paymentRepository.cancelPaymentIntent(paymentIntentId);
}

export async function getPaymentIntentService(paymentIntentId: string) {
  const { paymentRepository } = createServerRepositories();
  return paymentRepository.getPaymentIntent(paymentIntentId);
}

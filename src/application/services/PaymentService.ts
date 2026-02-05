import { createRepositories } from "@/infrastructure/factories/createRepositories";
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
  const { paymentRepository } = createRepositories();
  const useCase = new CreatePaymentIntent(paymentRepository);
  return useCase.execute(input);
}

export async function createCheckoutSessionService(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const { paymentRepository } = createRepositories();
  const useCase = new CreateCheckoutSession(paymentRepository);
  return useCase.execute(input);
}

export async function processWebhookEventService(
  payload: string,
  signature: string
): Promise<ProcessWebhookResult> {
  const { paymentRepository, bookingRepository } = createRepositories();
  const useCase = new ProcessWebhookEvent(paymentRepository, bookingRepository);
  return useCase.execute(payload, signature);
}

export async function cancelPaymentIntentService(paymentIntentId: string): Promise<void> {
  const { paymentRepository } = createRepositories();
  return paymentRepository.cancelPaymentIntent(paymentIntentId);
}

export async function getPaymentIntentService(paymentIntentId: string) {
  const { paymentRepository } = createRepositories();
  return paymentRepository.getPaymentIntent(paymentIntentId);
}

import { endpoints } from "../../configs/endpoints";
import { userJourneyStore } from "../../stores/userJourneyStore";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation, useApiQuery } from "../network";
import { queryKeys } from "../queryKeys";
import {
  AddCardPayload,
  CardResponse,
  InstallmentMethodsResponse,
  PaymentCardsResponse,
  PaymentPayload,
  TamamOfferPayload,
  TamamOfferResponse,
} from "../types/payment";

export const usePayment = () => {
  const { childToken } = userJourneyStore.getState();
  const queryClient = useQueryClient();

  return useApiMutation<any, PaymentPayload>({
    apiConfig: ({ orderId }: any) => ({
      method: "POST",
      url: endpoints.payment.payment(orderId),
      headers: {
        ...(childToken && { Authorization: `Bearer ${childToken}` }),
      },
    }),
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.usermode] });
      },
    },
  });
};

export const usePaymentCardsQuery = () => {
  const { childToken } = userJourneyStore.getState();
  return useApiQuery<PaymentCardsResponse>({
    key: [queryKeys.paymentCards],
    apiConfig: {
      method: "GET",
      url: endpoints.payment.cards,
      headers: {
        ...(childToken && { Authorization: `Bearer ${childToken}` }),
      },
    },
  });
};

export const useAddCardMutation = () => {
  const { childToken } = userJourneyStore.getState();

  return useApiMutation<CardResponse, AddCardPayload>({
    apiConfig: {
      method: "POST",
      url: endpoints.payment.cards,
      headers: {
        ...(childToken && { Authorization: `Bearer ${childToken}` }),
      },
    },
  });
};

export const useInstallmentMethodQuery = (
  queryParams?: Record<string, string>,
  enabled = true
) => {
  return useApiQuery<InstallmentMethodsResponse[]>({
    key: [queryKeys.installmentMethods],
    apiConfig: {
      method: "GET",
      url: endpoints.payment.installmentsMethod,
      params: queryParams,
    },
    queryConfig: {
      enabled,
    },
  });
};

export const useTamamOfferMutation = () => {
  return useApiMutation<TamamOfferResponse[], TamamOfferPayload>({
    apiConfig: () => ({
      method: "POST",
      url: endpoints.payment.tamamOffers,
    }),
  });
};

export const useMultilineRenewPaymentMutation = () => {
  return useApiMutation<any, PaymentPayload>({
    apiConfig: ({ groupOrderId }: any) => ({
      method: "POST",
      url: endpoints.payment.multilineRenewPay(groupOrderId),
    }),
  });
};

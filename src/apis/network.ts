import {
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { type ApiError, type RequestType, request } from "./axiosInstance";

/**
 * hook for making API requests using TanStack Query.
 * @param key - Query key for caching & tracking.
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param url - API endpoint.
 * @param data - Request payload (optional).
 * @param queryConfig - Optional TanStack Query config overrides.
 */
export const useApiQuery = <T>({
  key,
  apiConfig,
  queryConfig,
}: {
  key: QueryKey;
  apiConfig: RequestType;
  queryConfig?: Partial<UseQueryOptions<T, ApiError>>;
}) => {
  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn: () => request(apiConfig),
    gcTime: 0,
    staleTime: 0,
    retry: 0,
    refetchOnWindowFocus: false,
    ...queryConfig,
  });
};

type ApiConfigFn<TVariables> = (variables?: TVariables) => RequestType;

/**
 * mutation hook for TanStack Query.
 *
 * @param mutationFn - Function that performs the mutation.
 * @param mutationConfig - Optional mutation config overrides.
 */
export const useApiMutation = <TData, TVariables = void>({
  apiConfig,
  mutationConfig,
}: {
  apiConfig: RequestType | ApiConfigFn<TVariables>;
  mutationConfig?: Partial<UseMutationOptions<TData, ApiError, TVariables>>;
}) => {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (variables?: TVariables) => {
      const finalConfig =
        typeof apiConfig === "function" ? apiConfig(variables) : apiConfig;
      return request<TData>({
        ...finalConfig,
        data: finalConfig?.data ?? variables,
      });
    },
    retry: 0,
    ...mutationConfig,
  });
};

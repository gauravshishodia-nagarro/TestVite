import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import axios, { type AxiosRequestConfig, type Method } from "axios";
import { Platform } from "react-native";
import { showGlobalError } from "../helpers/globalError";
import i18n from "../utils/i18n";

export const UAT_BASE_URL = "https://uatokd.maanaginx.com";
export interface ApiResponse<T> {
  responseCode?: number;
  message?: string;
  data: T | null;
  //eligibilityStatus?: EligibilityStatus;
}

export interface ApiError<T = unknown> {
  message?: string;
  responseCode?: number;
  data?: T;
}

const api = axios.create({
  baseURL: UAT_BASE_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const { accessToken, language } = useUserPreferenceStore.getState();
    if (!config.headers.Authorization && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // if (accessToken) {
    // 	config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    config.headers["accept-version"] = "7.53.0";
    config.headers["device-type"] = Platform.OS;
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    const erroMessage =
      error?.response?.data?.message ||
      error?.message ||
      i18n.t("label.somethingWentWrong");

    showGlobalError(erroMessage, status);

    return Promise.reject(error);
  }
);

export type RequestType = {
  method: Method;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  params?: any;
  headers?: Record<string, string>;
};
/**
 * API request function.
 *
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param url - API endpoint
 * @param data - Request payload (optional)
 * @param config - Axios request config (optional, for headers or other overrides)
 * @returns Promise<T> - Typed response data
 */
export const request = async <T>(requestData: RequestType): Promise<T> => {
  try {
    const response = await api.request<ApiResponse<T>>({
      method: requestData.method,
      url: requestData.url,
      data: requestData.data,
      params: requestData.params,
      headers: {
        ...(requestData.headers || {}), // merge custom headers
      },
      ...requestData.config,
    });
    //console.log('response::', response);

    if (
      (response.data.responseCode || 200) === 200 ||
      response.data.responseCode === 201
    ) {
      // //TODO remove it once response change from BE
      // if (response.data.eligibilityStatus) {
      // 	const mergedData = {
      // 		...response.data.data,
      // 		eligibilityStatus: response.data.eligibilityStatus,
      // 	};
      // 	return mergedData as T;
      // }
      return (response.data.data || response.data) as T;
    } else {
      throw {
        message:
          response.data.message ||
          `Server Error: ${response.data.responseCode}`,
        data: response.data.data,
        responseCode: response.data.responseCode,
      } as ApiError<T>;
    }
  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error.message);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
      data: error?.response.data.data,
      responseCode: error?.response?.data?.responseCode,
    } as ApiError<T>;
  }
};

export default api;

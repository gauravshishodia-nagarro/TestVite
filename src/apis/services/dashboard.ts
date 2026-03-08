import { endpoints } from "../../configs/endpoints";
import { useApiQuery } from "../network";
import { queryKeys } from "../queryKeys";
import { UserModeResponse } from "../types/dashboard";

export const useUserModeQuery = () => {
  return useApiQuery<UserModeResponse>({
    key: [queryKeys.usermode],
    apiConfig: {
      method: "GET",
      url: endpoints.bffService.dashboard.userMode,
    },
  });
};

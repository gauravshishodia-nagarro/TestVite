import { endpoints } from "../../configs/endpoints";
import { useUserPreferenceStore } from "../../stores/userPreferencesStore";
import { useApiQuery } from "../network";
import { queryKeys } from "../queryKeys";
import {
  DeviceListResponse,
  JourneyStepResponse,
  PackageType,
  PackagesResponse,
  ProductDetailResponse,
  VariantValue,
} from "../types/store";

export const parsePackagesList = (allPackages: PackageType[]) => {
  if (!allPackages) return [];

  const passed: string[] = [];

  return allPackages
    .map((pkg) => {
      if (passed.includes(pkg.sku)) return undefined;

      const packageConfigAttributes = {
        packageImage: pkg.package_logo_image,
        packageColor: pkg.package_color,
        packageOrder: pkg.package_order,
        bannerText: pkg.banner_text,
        bannerTextColor: pkg.banner_text_color,
        bannerBackgroundColor: pkg.banner_background_color,
        packageFeaturesLinkText: pkg.package_features_link_text,
        packagesFeatures: {
          iconUrl: pkg.package_features?.pkg_feature_icon_url,
          title: pkg.package_features?.pkg_feature_title,
          description: pkg.package_features?.pkg_feature_description,
          helpGuidelines:
            pkg.package_features?.pkg_feature_helpguideline
              ?.split("•")
              .filter(Boolean) ?? [],
        },
      };
      if (pkg.sim_linking) {
        const linkedPkg = allPackages.find(
          (item) => item.sku === pkg.sim_linking
        );
        if (!linkedPkg) return { ...pkg, ...packageConfigAttributes };

        passed.push(pkg.sku, linkedPkg.sku);

        const esimPackage = pkg.package_for === "esim" ? pkg : linkedPkg;
        const physicalPackage = pkg.package_for === "default" ? pkg : linkedPkg;

        return {
          ...physicalPackage,
          ...packageConfigAttributes,
          esimPackage,
        };
      } else {
        passed.push(pkg.sku);
        return { ...pkg, ...packageConfigAttributes };
      }
    })
    .filter((pkg) => pkg !== undefined);
};

const removeDeviceVariants = (
  deviceDetails: ProductDetailResponse,
  filterKey = "device_variant",
  matchChar = "sim"
) => {
  const details = { ...deviceDetails };
  let deviceVariantArray: VariantValue[] = [];

  for (const [index, item] of deviceDetails.variant.entries()) {
    if (item?.id === filterKey) {
      deviceVariantArray = item?.values?.filter((variant) => {
        return !variant?.title?.toLowerCase()?.includes(matchChar);
      });
      if (deviceVariantArray?.length !== 1) {
        deviceVariantArray = [item?.values[item?.values?.length - 1]];
      }

      details.variant[index] = { ...item, values: deviceVariantArray };
    }
  }

  const variantIds = deviceVariantArray.map((v) => v.id);

  const filteredList = details.list.filter((item) => {
    return variantIds.includes(item.variant.device_variant);
  });

  details.list = filteredList;

  return details;
};

export const useGetPackagesQuery = () => {
  const isAutheuserncatedUser =
    useUserPreferenceStore.getState().accessToken !== null;
  const url = isAutheuserncatedUser
    ? endpoints.bffService.store.packagesAuthenticateUser
    : endpoints.bffService.store.packages;
  return useApiQuery<PackagesResponse>({
    key: [queryKeys.packages],
    apiConfig: {
      method: "GET",
      url,
    },
    queryConfig: {
      gcTime: Number.POSITIVE_INFINITY,
      staleTime: Number.POSITIVE_INFINITY,
      // select: (data) => {
      // 	return {
      // 		...data,
      // 		packages: parsePackagesList(data.packages),
      // 	};
      // },
    },
  });
};

export const useJourneyStepQuery = (
  journeyType: string,
  userType: string,
  queryParams?: Record<string, string>
) => {
  return useApiQuery<JourneyStepResponse>({
    key: [queryKeys.journeySteps],
    apiConfig: {
      method: "GET",
      url: endpoints.bffService.journey.journeySteps(journeyType, userType),
      params: queryParams,
    },
    // queryConfig: {
    // 	gcTime: Number.POSITIVE_INFINITY,
    // 	staleTime: Number.POSITIVE_INFINITY,
    // },
  });
};

export const useDeviceListQuery = () => {
  return useApiQuery<DeviceListResponse>({
    key: [queryKeys.deviceList],
    apiConfig: {
      method: "GET",
      url: endpoints.bffService.store.deviceList,
    },
  });
};

export const useProductDetailQuery = (productSku: string) => {
  return useApiQuery<ProductDetailResponse>({
    key: [queryKeys.productDetail],
    apiConfig: {
      method: "GET",
      url: endpoints.bffService.store.productDetail(productSku),
    },
    queryConfig: {
      select: (data) => removeDeviceVariants(data),
    },
  });
};

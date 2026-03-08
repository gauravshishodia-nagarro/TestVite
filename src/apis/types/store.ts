export type StoreCategoryType = {
  id: number;
  skus: string[];
  name: string;
};

export type PackageInfo = {
  validity: {
    days: string;
    applicable_for: string;
  };
  internet: {
    roaming: {
      included: string | null;
      social: string | null;
    };
    non_roaming: {
      included: {
        data: string;
        unit: string;
        description: string | null;
      } | null;
      social: string | null;
    };
    auto_renewal_data: string;
  };
  talktime: {
    roaming: {
      local: string | null;
      intl: string | null;
    };
    non_roaming: {
      local: {
        data: string;
        unit: string;
        description: string;
      } | null;
      intl: {
        data: string;
        unit: string;
        description: string;
      } | null;
    };
  };
  sms: {
    roaming: {
      local: string | null;
      intl: string | null;
    };
    non_roaming: {
      local: string | null;
      intl: string | null;
    };
  };
  telco_meta_data: {
    package_app_count: number | null;
    package_gift_count: number | null;
    telco_add_on_type: string | null;
    apps_data_value_type: string | null;
    is_roaming_only: boolean;
    calls_eligibility: string | null;
    validity: string | null;
  };
};

type SegmentFormatType = {
  bold: boolean;
  underline: boolean;
  italic: boolean;
  strike_through: boolean;
  hyper_link: string;
  color: string;
};

type SegmentType = {
  text: string;
  format: SegmentFormatType;
};

type FeatureType = {
  icon_path: string;
  segments: SegmentType[];
  showApps?: boolean;
  identifier: "talktime" | "internet" | "validity" | "app" | "5G_compatiblity";
};

export type PackageType = {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: string;
  price: number;
  description: string;
  status: string;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  matrix_product_id: string;
  matrix_product_amount: string;
  package_info: PackageInfo;
  telco_package_card: string;
  package_behavior: string; // in V1 it is yaqoot_pkg_type: string;
  package_for: string; // in V1 it is yaqoot_package_type
  packageoption: string[]; // in V1 it is package_applicable_for
  price_tax: number;
  sim_linking: string;
  product_tax_amount: number;
  product_tax_percentage: number; // previously it was coming product_tax_percent
  is_special_offer: string;
  package_color: string;
  package_order: number;
  package_order_data: number;
  banner_text: string;
  banner_text_color: string;
  banner_background_color: string;
  package_features_link_text: string;
  package_features: {
    pkg_feature_icon_url: string;
    pkg_feature_title: string;
    pkg_feature_description: string;
    pkg_feature_helpguideline: string;
  };
  upgrade_downgrade_allowed: string;
  package_logo_image: string;
  has_gaming: string;
  new_package_flag: string;
  loyalty_discounts: null | string;
  website_image: string;
  mokafaa_welcome_point: null | string;
  loyalty_banner_text: null | string;
  loyalty_banner_text_color: null | string;
  loyalty_banner_background_color: null | string;
  device_linking: string;
  package_linking: string;
  package_price: string;
  download_speed: string;
  upload_speed: string;
  yaqoot_product_type: string;
  features: FeatureType[];

  // New local property for clubbed eSIM
  esimPackage?: PackageType;
  banner: PackageDetailsBannerType[];

  is_new_package: boolean;
  product_type: string;
  sort_order?: string;
  applicable_benefit_on_sku: number;
  applied_benefit_name: string;
  applied_promo_code: string;
  custom_promocode_price: any;
  promo_codes: string[];
  active_package: boolean;
  packageChangeDetails?: PackageChangeDetails;
  dayLeft?: number;
  renewable?: boolean;
};

export interface PackageChangeDetails {
  disableButton: boolean;
  changeType?: string;
}

export type PackagesResponse = {
  packages: PackageType[];
  store_categories: StoreCategoryType[];
  firstPackagePending: boolean;
  packageState: string;
  subscriptionType: string;
  userStatus: string;
  static_content: any[];
};

export interface JourneyStepResponse {
  types: Type[];
  steps: Steps;
}

export interface Type {
  key: string;
  enabled: string;
  title: string;
}

export interface Steps {
  ESIM: string[];
  SIM: string[];
}

export interface ProductDetailResponse {
  category_title: string;
  description: string;
  specifications: Specification[];
  variant: Variant[];
  list: List[];
}

export interface Specification {
  name: string;
  value: string;
}

export interface Variant {
  id: string;
  title: string;
  values: VariantValue[];
}

export interface VariantValue {
  color_code?: string[];
  id: string;
  title: string;
}

export interface List {
  id: number;
  sku: string;
  name: string;
  image: string[];
  variant: Variant2;
  total_price: string;
  out_of_stock: boolean;
  brand_name: string;
}

export interface Variant2 {
  color: string;
  device_variant: string;
  size: string;
}
export interface DeviceCategory {
  id: string;
  name: string;
}

export interface Device {
  id: number;
  sku: string;
  name: string;
  thumbnail_image: string;
  starting_price: string;
  brand_name: string;
  category_id: string[];
  product_tag: ProductTag;
}

export type DeviceListResponse = {
  category: DeviceCategory[];
  product: Device[];
};

export type ProductTag = {
  title: string;
  color: string;
};

export type PackageDetailsBannerType = {
  id: string;
  text: string;
  text_color: string;
  background_color: string;
  icon: string;
};

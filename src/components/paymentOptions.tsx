import { Pressable, View } from "react-native";
import { InstallmentMethodsResponse } from "../apis/types/payment";
import { List } from "../apis/types/store";
import { PAYMENT_INSTALLMENT_METHOD } from "../types";
import CustomText from "./customText";
import GenericImage from "./image";
import SVGIcon from "./svgIcon";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { useNavigation } from "@react-navigation/native";

interface PaymentOptionProps {
  installmentMethods?: InstallmentMethodsResponse[];
  type?: "DEVICE" | "HOME_PACKAGE";
  selectedDeviceVariant?: Partial<List>; // for Device type only
}

export const isBNPLOptionDisbaled = (
  type: "DEVICE" | "HOME_PACKAGE",
  total_price: string,
  item: InstallmentMethodsResponse
) => {
  let isDisabled = false;
  if (type === "DEVICE") {
    const price = Number(total_price ?? "0");
    const showBNPLOption =
      price >= (item?.minimum_value ?? 0) &&
      price <= (item?.maximum_value ?? 0);
    // TODO: need to add add Tamam and show_tamam, show_tamara etc condition when getting this is in API response
    isDisabled =
      item?.payment_installment_method === PAYMENT_INSTALLMENT_METHOD.TAMAM
        ? false
        : !showBNPLOption;
  }
  return isDisabled;
};

export const PaymentOptions: React.FC<PaymentOptionProps> = ({
  installmentMethods,
  type = "DEVICE",
  selectedDeviceVariant,
}) => {
  const navigation = useNavigation();
  const { t } = useAppTranslation();
  const handleOptionPress = (item: InstallmentMethodsResponse) => {
    if (item.info_url) {
      //TODO change with actual price
      const web_source = item.info_url?.replace("<price>", "200");
      //TODO: handle route
      navigation.navigate("Store", {
        url: web_source,
        type: "installment",
      });
    }
  };
  return (
    <View className="bg-shades-blue-06 rounded-[10] py-3 px-4">
      <CustomText
        fontVarient="regular"
        className="text-sm text-shades-gray-03 text-left"
      >
        {t("common.paymentOptionHeading")}
      </CustomText>
      <View className="flex-row gap-2 py-2">
        {installmentMethods?.map((item) => {
          if (!item?.feature_enabled) {
            return null;
          }
          const isDisabled = isBNPLOptionDisbaled(
            type,
            selectedDeviceVariant?.total_price ?? "0",
            item
          );

          return (
            <Pressable
              className={`w-[70px] h-[32px] bg-secondary-white border-shades-gray-06 border rounded-lg px-1 justify-center items-center backdrop-opacity-50 ${
                isDisabled ? "opacity-50" : "opacity-100"
              }`}
              key={item.name}
              disabled={isDisabled}
              onPress={() => {
                switch (item.name) {
                  case "tamam":
                    //TODO: handle route
                    navigation.navigate("TamamInfo", {
                      amount: selectedDeviceVariant?.total_price ?? 0,
                    });
                    break;
                  default:
                    handleOptionPress(item);
                }
              }}
            >
              <View className="absolute top-1 end-1">
                <SVGIcon
                  name={"info"}
                  width={6}
                  height={6}
                  viewBox="0 0 20 20"
                />
              </View>

              <GenericImage
                uri={item.image_url}
                resizeMode="contain"
                height="h-[16px]"
                width="w-[55px]"
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

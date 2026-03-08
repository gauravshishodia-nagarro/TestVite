import { ImageBackground } from "expo-image";
import { View } from "react-native";
import CustomText from "./customText";
import GenericImage from "./image";
import PriceWithCurrencey from "./priceWithCurrencey";
import { useAppTranslation } from "../hooks/useAppTranslation";

type RenewalOfferProps = {
  containerClassName?: string;
  bgContainerClassName?: string;
  actionButton?: React.ReactNode;
};
const RenewalOfferComponent: React.FC<RenewalOfferProps> = (props) => {
  const {
    containerClassName = "",
    actionButton,
    bgContainerClassName = "",
  } = props;
  const { t } = useAppTranslation();
  return (
    <View className={`rounded-t-xl bg-white mb-4 ${containerClassName}`}>
      <View
        className={`rounded-xl w-full overflow-hidden ${bgContainerClassName}`}
      >
        <ImageBackground
          source={require("../../public/images/renewal-offer-bg.webp")}
          // resizeMode="cover"
          contentFit="cover"
          // className={`rounded-xl`}
        >
          <View className="py-2 px-2 flex-row items-center gap-2 ">
            <View className="flex-row gap-2 items-center flex-grow">
              <GenericImage
                height="40"
                width="40"
                className="h-10 w-10"
                resizeMode="contain"
                uri={require("../../public/images/renewal-offer-logo.webp")}
              />
              <View className={`${actionButton ? "max-w-[75%]" : ""}`}>
                <CustomText
                  fontVarient="bold"
                  className="text-xs text-secondary-gray"
                >
                  {t("label.renewalOffer!")}
                </CustomText>
                <View className="flex-row items-center gap-1 mt-1 flex-wrap">
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02 items-center justify-center"
                  >
                    {t("label.save")}
                  </CustomText>
                  <PriceWithCurrencey
                    width={10}
                    height={11}
                    price={12}
                    customTextClassName={`text-xs text-shades-gray-02 font-primary-medium`}
                  />
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02"
                  >
                    {t("label.onPackagePrice")}
                  </CustomText>
                  <CustomText
                    fontVarient="medium"
                    className="text-xs text-shades-gray-02 mx-[2px]"
                  >
                    {"& 10GB"}
                  </CustomText>
                  <CustomText
                    fontVarient="regular"
                    className="text-xs text-shades-gray-02"
                  >
                    {t("label.extraData")}
                  </CustomText>
                </View>
              </View>
            </View>
            {actionButton && actionButton}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
export default RenewalOfferComponent;

import { Platform, View } from "react-native";
import constants from "../configs/constants";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { setAccessibilityProps } from "../types";
import { isRTL } from "../utils/formatter";
import CustomText from "./customText";
import GenericImage from "./image";
import PriceWithCurrencey from "./priceWithCurrencey";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface SmallStoreCardProps {
  withTag?: boolean;
  uri: string;
  tagBGColor?: string;
  tagText?: string;
  title: string;
  subTitle?: string;
  price: number | string;
  nativeID?: string;
  accessibilityLabel?: string;
  customeSubtitle?: React.ReactNode;
  imageContainerClassname?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageBGColor?: string;
}

const SmallStoreCard: React.FC<SmallStoreCardProps> = ({
  withTag = false,
  uri = "",
  tagBGColor = "bg-secondary-yellow",
  tagText,
  title,
  subTitle,
  price = 0,
  nativeID = "small_store_card",
  accessibilityLabel,
  customeSubtitle,
  imageContainerClassname,
  imageWidth,
  imageHeight,
  imageBGColor = "#FFF1DA",
}) => {
  const { animateColors } = constants;
  const { theme } = useUserPreferenceStore();
  const { t } = useAppTranslation();

  return (
    <View
      className={`border border-shades-purple-06 bg-secondary-white rounded-xl me-4 overflow-hidden ${animateColors}`}
      style={{
        shadowColor: Colors[theme].black,
        ...Platform.select({
          ios: {
            shadowOffset: { width: 0, height: 4 },
          },
        }),
        shadowOpacity: 0.02,
        shadowRadius: 30,
        elevation: 2,
      }}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel: accessibilityLabel,
      })}
    >
      <View
        className={`relative flex mb-[10px] justify-center items-center ${imageContainerClassname}`}
        style={{ backgroundColor: imageBGColor }}
      >
        <GenericImage
          uri={uri}
          height={imageHeight}
          width={imageWidth}
          resizeMode="contain"
        />
        {withTag && (
          <View
            className={`absolute bottom-[-8] px-2 py-[3px] rounded-3xl ${tagBGColor}`}
          >
            <CustomText
              className={`font-primary-regular text-xxs text-secondary-white`}
            >
              {tagText}
            </CustomText>
          </View>
        )}
      </View>
      <View>
        <View className="px-3 pb-2 border border-shades-purple-06 !border-t-transparent !border-x-transparent">
          <CustomText
            className={`pb-1 font-primary-medium text-sm text-secondary-gray ${
              Platform.OS === "web" && isRTL() ? "text-right" : "text-left"
            }`}
          >
            {title}
          </CustomText>
          {customeSubtitle || (
            <CustomText
              className={`font-primary-regular text-sm text-shades-gray-03 ${
                Platform.OS === "web" && isRTL() ? "text-right" : "text-left"
              }`}
            >
              {subTitle}
            </CustomText>
          )}
        </View>
        <View className="px-3 pt-2 pb-3">
          {price === 0 || price === 0.0 || price === "0.0" || price === "0" ? (
            <CustomText
              className={`pt-2 font-primary-medium text-base text-secondary-green text-left text-start`}
            >
              {t("common.free")}
            </CustomText>
          ) : (
            <>
              <PriceWithCurrencey
                price={price}
                bgColor={Colors[theme].secondaryGreen}
                customTextClassName={`font-primary-bold text-base text-secondary-green text-left text-start`}
                customDecimalTextClassName={"text-xs"}
              />
              <CustomText
                className={`font-primary-regular text-xs pt-[2px] text-shades-gray-03 text-left text-start`}
              >
                {t("common.vatIncl")}
              </CustomText>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default SmallStoreCard;

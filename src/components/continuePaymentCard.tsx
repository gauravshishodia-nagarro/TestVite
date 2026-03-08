import { View } from "react-native";
import constants from "../configs/constants";
import CustomButton from "./customButton";
import CustomText from "./customText";
import GenericImage from "./image";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface ContinuePaymentCardProps {
  onContinuePress: () => void;
  containeClassname?: string;
}
const ContinuePaymentCard: React.FC<ContinuePaymentCardProps> = ({
  onContinuePress,
  containeClassname,
}) => {
  const { animateColors } = constants;
  const { t } = useAppTranslation();
  return (
    <View
      className={`w-full bg-secondary-white p-4 rounded-2xl gap-6 mt-6 ${animateColors} ${containeClassname}`}
    >
      <GenericImage
        height="h-[85px]"
        resizeMode="contain"
        uri={require("../../public/images/continue-payment.webp")}
      />
      <View className="gap-1 justify-center items-center">
        <CustomText
          className={`font-primary-bold text-lg text-secondary-gray px-4`}
        >
          {t("label.continuePay")}
        </CustomText>
        <CustomText
          className={`font-primary-regular text-sm text-shades-gray-02 text-center px-4`}
        >
          {t("label.continuePayMessage")}
        </CustomText>
      </View>
      <CustomButton
        label={t("button.continuePayment")}
        onPress={onContinuePress}
        containerClassName={"!py-2"}
        labelFontName={"font-primary-regular"}
      />
    </View>
  );
};

export default ContinuePaymentCard;

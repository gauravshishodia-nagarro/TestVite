import { View } from "react-native";
import constants from "../configs/constants";
import { SIM_TYPE } from "../types";
import CustomButton from "./customButton";
import CustomText from "./customText";
import GenericImage from "./image";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface ActivateEsimCardProps {
  onActivatePress: () => void;
  simType: SIM_TYPE;
}
const ActivateSimCard: React.FC<ActivateEsimCardProps> = ({
  onActivatePress,
  simType,
}) => {
  const { animateColors } = constants;
  const { t } = useAppTranslation();
  return (
    <View
      className={`w-full bg-secondary-white p-4 rounded-2xl gap-6 ${animateColors} mt-6`}
    >
      <GenericImage
        height="h-[85px]"
        resizeMode="contain"
        uri={require("../../public/images/activate-esim-card.webp")}
      />
      <View className="gap-1 justify-center items-center">
        <CustomText
          className={`font-primary-bold text-lg text-secondary-gray px-4`}
        >
          {simType === SIM_TYPE.ESIM
            ? t("label.activateeSIM")
            : t("common.activateSIM")}
        </CustomText>
        <CustomText
          className={`font-primary-regular text-sm text-shades-gray-02 text-center px-4`}
        >
          {t("label.activateeSIMMessage")}
        </CustomText>
      </View>
      <CustomButton
        label={t("action.activate")}
        onPress={onActivatePress}
        containerClassName={"!py-2"}
        labelFontName={"font-primary-regular"}
      />
    </View>
  );
};

export default ActivateSimCard;

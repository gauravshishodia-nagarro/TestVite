import { View } from "react-native";
import constants from "../configs/constants";
import CustomButton from "./customButton";
import CustomText from "./customText";
import GenericImage from "./image";
import { useAppTranslation } from "../hooks/useAppTranslation";

interface TrackOrActivateSimCardProps {
  onTrackPress: () => void;
  onActivatePress: () => void;
}
const TrackOrActivateSimCard: React.FC<TrackOrActivateSimCardProps> = ({
  onTrackPress,
  onActivatePress,
}) => {
  const { animateColors } = constants;
  const { t } = useAppTranslation();
  return (
    <View
      className={`w-full bg-secondary-white p-4 rounded-2xl justify-center items-center ${animateColors}`}
    >
      <GenericImage
        height="h-[85px]"
        resizeMode="contain"
        uri={require("../../public/images/track-or-activate.webp")}
      />
      <CustomText
        className={`font-primary-bold text-lg text-secondary-gray mt-4 px-4`}
      >
        {t("label.tractOrActivate")}
      </CustomText>
      <CustomText
        className={`font-primary-regular text-sm text-shades-gray-02 mt-1 text-center px-4`}
      >
        {t("label.alreadyReceivedSIM")}
      </CustomText>
      <View className="flex-row gap-4 mt-4">
        <CustomButton
          label={t("button.track")}
          onPress={onTrackPress}
          containerClassName={"!py-2"}
          labelFontName={"font-primary-regular"}
          type="outlined"
          outlinedBGColor="bg_transparent"
        />
        <CustomButton
          label={t("button.activate")}
          onPress={onActivatePress}
          containerClassName={"!py-2"}
          labelFontName={"font-primary-regular"}
        />
      </View>
    </View>
  );
};

export default TrackOrActivateSimCard;

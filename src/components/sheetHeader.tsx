import { Pressable, View } from "react-native";
import constants from "../configs/constants";
import { Colors } from "../configs/themes";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { isRTL } from "../utils/formatter";
import { closeSheetModal } from "../utils/util";
import CustomText from "./customText";
import SVGIcon from "./svgIcon";

type SheetHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  showBack?: boolean;
};

export const SheetHeader = ({
  title,
  onBackPress,
  showBack,
}: SheetHeaderProps) => {
  const { theme } = useUserPreferenceStore();

  const { actionOpacity, animateOpacity, fontPrimaryBold } = constants;

  const displayBack = showBack;
  const showTitle = !!title;

  // If nothing to render, skip header entirely
  // if (!displayBack && !showTitle) return null;

  return (
    <View className={`pt-8 px-5 flex-col gap-6`}>
      {displayBack && (
        <Pressable
          onPress={onBackPress || closeSheetModal}
          className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity}`}
        >
          <View className={isRTL() ? "rotate-180" : ""}>
            <SVGIcon
              name="back"
              width={24}
              height={24}
              stroke={Colors[theme].black}
            />
          </View>
        </Pressable>
      )}

      {showTitle && (
        <CustomText
          className={`text-secondary-gray text-xl text-left ${fontPrimaryBold} `}
        >
          {title}
        </CustomText>
      )}
    </View>
  );
};

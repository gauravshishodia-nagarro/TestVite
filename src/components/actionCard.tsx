import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import constants from "../configs/constants";
import CustomText from "./customText";
import GenericImage from "./image";
import SVGIcon from "./svgIcon";

interface ActionCardProps {
  icon: string;
  text: string;
  openActionCard: () => void;
  closeActionCard: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  text,
  openActionCard,
  closeActionCard,
  containerStyle = {},
}) => {
  const { animateOpacity, actionOpacity } = constants;
  const onOpenActionCard = (e: GestureResponderEvent) => {
    e.preventDefault();
    openActionCard();
  };
  const isLeadingIconSVG = typeof icon === "string" && !icon.startsWith("http");

  return (
    <Pressable
      style={containerStyle}
      onPress={onOpenActionCard}
      className={`p-3 flex flex-row flex-between items-center gap-6 border border-shades-gray-06 rounded-2xl overflow-hidden ${actionOpacity} ${animateOpacity}`}
    >
      <View className="flex flex-row gap-3 items-center">
        {isLeadingIconSVG ? (
          <SVGIcon name={icon} width={32} height={32} viewBox="0 0 32 32" />
        ) : (
          <GenericImage
            uri={icon || ""}
            width={"w-[32px]"}
            height={"h-[32px]"}
            resizeMode="contain"
          />
        )}

        <CustomText
          className={`text-secondary-gray text-base font-primary-medium`}
        >
          {text}
        </CustomText>
      </View>
      <Pressable onPress={closeActionCard}>
        <SVGIcon name={"close"} width={24} height={24} viewBox="0 0 24 24" />
      </Pressable>
    </Pressable>
  );
};

export default ActionCard;

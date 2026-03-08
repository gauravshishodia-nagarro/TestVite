import { StyleProp, TextStyle, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { formatPriceToDecimalPrice } from "../utils/formatter";
import CustomText from "./customText";

interface PriceWithCurrenceyProps {
  width?: number;
  height?: number;
  bgColor?: string;
  price: number | string;
  customTextClassName?: undefined | string;
  showStrikeThroughLine?: boolean;
  strikeLineColor?: string;
  customTextStyle?: StyleProp<TextStyle>;
  customDecimalTextClassName?: undefined | string;
  showCurrenyInNegative?: boolean;
  showCurrenyInPositive?: boolean;
  leadingSymbolClassName?: string;
}

const PriceWithCurrencey: React.FC<PriceWithCurrenceyProps> = ({
  width = 16,
  height = 16,
  bgColor = "rgb(0, 0, 0)",
  price = 0,
  customTextClassName = undefined,
  showStrikeThroughLine = false,
  strikeLineColor = "bg-shades-gray-02",
  customTextStyle = {},
  showCurrenyInNegative = false,
  showCurrenyInPositive = false,
  leadingSymbolClassName = "",
  customDecimalTextClassName = undefined,
}) => {
  const formattedPrice = formatPriceToDecimalPrice(price);
  const decimal = formattedPrice.split(".")[1] || "00";
  const integer = formattedPrice.split(".")[0];

  return (
    <View className="flex flex-row items-center gap-1">
      {showCurrenyInNegative && (
        <CustomText
          className={`text-sm text-shades-gray-01 ${leadingSymbolClassName}`}
        >
          -
        </CustomText>
      )}

      {showCurrenyInPositive && (
        <CustomText
          className={`text-sm text-shades-gray-01 ${leadingSymbolClassName}`}
        >
          +
        </CustomText>
      )}
      <Svg width={width} height={height} viewBox="0 0 1124.14 1256.39">
        <Path
          fill={bgColor}
          d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
        />
        <Path
          fill={bgColor}
          d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
        />
      </Svg>
      <CustomText
        className={
          customTextClassName
            ? customTextClassName
            : `font-primary-medium text-base text-secondary-gray text-left text-start`
        }
        style={customTextStyle}
      >
        {integer}
        <CustomText className={customDecimalTextClassName}>
          .{decimal}
        </CustomText>
      </CustomText>
      {showStrikeThroughLine && (
        <View
          className={`absolute h-[1px] left-0 right-0 top-[${
            width / 2
          }px] ${strikeLineColor}`}
        />
      )}
    </View>
  );
};

export default PriceWithCurrencey;

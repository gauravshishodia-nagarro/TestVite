import { useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CustomButton from "../components/customButton";
import Divider from "../components/divider";
import RadioButton from "../components/radioButton";
import constants from "../configs/constants";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { setAccessibilityProps } from "../types";
import { useAppTranslation } from "../hooks/useAppTranslation";

export type MobileNumberSelectionSheetProps = {
  numbers: string[];
  nativeID?: string;
  accessibilityLabel?: string;
  initialNumber: string;
  buttonLabel?: string;
  selectedNumber: string;
  onWebContinue?: () => void;
};

const MobileNumberSelectionSheet: React.FC = () => {
  const { height } = useWindowDimensions();
  const { t } = useAppTranslation();

  const { bottomSheetOptions } = useBottomSheetStore();

  const {
    numbers,
    nativeID = "mobile_number_selection_sheet",
    accessibilityLabel,
    initialNumber,
    onWebContinue,
  }: MobileNumberSelectionSheetProps = bottomSheetOptions.props;

  const [selectedVal, setSelectedVal] = useState(initialNumber);
  const { updateActiveSheetProps } = useBottomSheetStore.getState();
  console.log("numbers", numbers);

  return (
    <View
      className={"bg-shades-purple-06 pb-8 px-5 web:flex-1"}
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <View
        style={{
          maxHeight: Platform.OS === "web" ? height * 0.85 : height * 0.8,
        }}
      >
        <FlatList
          data={numbers}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="my-4 py-6 bg-white rounded-xl px-4"
          ItemSeparatorComponent={() => <Divider containerClassName="my-6" />}
          renderItem={({ item }) => (
            <RadioButton
              label={item}
              // containerClassName="pt-6 pb-4"
              selected={item === selectedVal}
              onPress={() => {
                setSelectedVal(item);
                updateActiveSheetProps({ selectedNumber: item });
              }}
              labelClassName={constants.fontPrimaryMedium}
            />
          )}
        />
      </View>
      {Platform.OS === "web" && (
        <CustomButton
          containerClassName="mt-5 mx-[10%]"
          label={t("button.continue")}
          onPress={() => {
            useBottomSheetStore.getState().setWebModalVisible(false);
            onWebContinue?.();
          }}
        />
      )}
    </View>
  );
};
export default MobileNumberSelectionSheet;

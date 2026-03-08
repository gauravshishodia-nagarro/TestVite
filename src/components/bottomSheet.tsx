import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { Pressable } from "react-native";
import { bottomSheets } from "../configs/bottomSheets";
import { Colors } from "../configs/themes";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";
import { SheetHeader } from "./sheetHeader";
import { MotiView } from "moti";

const CustomBottomSheet: React.FC = () => {
  const { theme } = useUserPreferenceStore();
  const { setActiveSheet, activeSheet, bottomSheetOptions } =
    useBottomSheetStore();
  const sheetContent = activeSheet ? bottomSheets[activeSheet] : null;
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const renderBackdrop = useCallback(
    (props: any) =>
      activeSheet && (
        <MotiView
          {...props}
          from={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 400 }}
          pointerEvents={activeSheet === null ? "none" : "auto"}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 999,
          }}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: "black" }}
            onPress={() => setActiveSheet(null)}
          />
        </MotiView>
      ),
    [activeSheet],
  );

  useEffect(() => {
    if (activeSheet) {
      bottomSheetRef.current?.snapToIndex(bottomSheetOptions.index ?? 0);
    }
    if (activeSheet === null) {
      bottomSheetRef.current?.close();
    }
  }, [setActiveSheet, activeSheet, bottomSheetOptions]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={bottomSheetOptions.snapPoints}
      enableDynamicSizing={bottomSheetOptions.enableDynamicSizing}
      keyboardBehavior={bottomSheetOptions.keyboardBehavior}
      handleIndicatorStyle={{
        backgroundColor: Colors[theme].shadesPurple05,
        borderRadius: 20,
        height: 6,
        width: 40,
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: Colors[theme].secondarySmoke }}
      backgroundComponent={undefined}
      containerStyle={{ zIndex: 1000 }}
      footerComponent={bottomSheetOptions.renderFooter}
      enableBlurKeyboardOnGesture={
        bottomSheetOptions.enableBlurKeyboardOnGesture
      }
    >
      <BottomSheetView>
        <SheetHeader
          title={bottomSheetOptions.title}
          onBackPress={bottomSheetOptions.onBackPress}
          showBack={bottomSheetOptions.showBack}
        />
        {sheetContent}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;

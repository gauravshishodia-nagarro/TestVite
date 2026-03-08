import React from "react";
import { Linking, Platform, View } from "react-native";
import CustomButton from "../components/customButton";
import CustomText from "../components/customText";
import GenericImage from "../components/image";
import { useBottomSheetStore } from "../stores/useBottomSheetStore";
import { setAccessibilityProps } from "../types";
import { useAppTranslation } from "../hooks/useAppTranslation";

export const ABSHER_LINK_IOS =
  "https://apps.apple.com/us/app/absher-أبشر/id1004966456";
export const ABSHER_LINK_ANDROID =
  "https://play.google.com/store/apps/details?id=sa.gov.moi";

export const NAFATH_LINK_IOS =
  "https://apps.apple.com/qa/app/نفاذ-nafath/id1598909871";
export const NAFATH_LINK_ANDROID =
  "https://play.google.com/store/apps/details?id=sa.gov.nic.myid";

export type IndentityVerificationSheetProps = {
  nativeID?: string;
  accessibilityLabel?: string;
  type?: "ABSHER" | "NAFATH";
  onPress: () => void;
};

const IdentityVerificationSheet: React.FC = () => {
  const { bottomSheetOptions } = useBottomSheetStore();
  const { t } = useAppTranslation();
  const {
    nativeID = "identity_verification_sheet",
    accessibilityLabel,
    type = "ABSHER",
    onPress,
  }: IndentityVerificationSheetProps = bottomSheetOptions.props;

  return (
    <View
      className="px-5 py-8"
      {...setAccessibilityProps({ nativeID, accessibilityLabel })}
    >
      <GenericImage
        uri={require("../../public/images/verify-number.webp")}
        width="w-[132px]"
        height="h-[132px]"
        className="self-center"
      />
      <CustomText
        className={`text-secondary-gray text-xl mt-6 ${
          Platform.OS === "web" ? "text-start" : "text-left"
        } font-primary-bold`}
      >
        {t("label.verifyYourInformation")}
      </CustomText>
      <View className="bg-secondary-white mt-4 rounded-lg p-4">
        <CustomText
          className={`text-sm text-secondary-gray ${
            Platform.OS === "web" ? "text-start" : "text-left"
          } font-primary-regular`}
        >
          {`${t(
            type === "ABSHER"
              ? "label.absherVerificationInstruction"
              : "label.nfathVerificationInstruction"
          )} `}
          <CustomText
            onPress={() => {
              const iosLink =
                type === "ABSHER" ? ABSHER_LINK_IOS : NAFATH_LINK_IOS;
              const androidLink =
                type === "ABSHER" ? ABSHER_LINK_ANDROID : NAFATH_LINK_ANDROID;

              Linking.openURL(Platform.OS === "ios" ? iosLink : androidLink);
            }}
            className="text-secondary-blue"
          >
            {Platform.OS === "ios"
              ? t("action.appStore")
              : t("action.googlePlay")}
          </CustomText>
        </CustomText>
        <CustomButton
          label={t(
            type === "ABSHER"
              ? "button.verifyWithAbsher"
              : "button.verifyWithNafath"
          )}
          onPress={onPress}
          containerClassName="mt-6"
        />
      </View>
    </View>
  );
};

export default IdentityVerificationSheet;

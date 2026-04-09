import CustomButton from "../components/customButton";
import CustomText from "../components/customText";
import GenericImage from "../components/genericImage";
import constants from "../configs/constants";
import { useAppTranslation } from "../hooks/useAppTranslation";
import { useUserNavigationStore } from "../stores/userNavigationStore";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { useLanguageToggle } from "../hooks/useLanguageToggle";
import { useNavigation } from "@react-navigation/native";
import { generateTWKToken } from "../helpers/twkHelper";
import { useVerifyTWKToken } from "../apis/services/authentication";
import { useUserPreferenceStore } from "../stores/userPreferencesStore";

type LanguageType = "Arabic" | "English";

const LanguageOptionCard = ({
  item,
  selected,
  onPress,
}: {
  item: {
    lang: LanguageType;
    label: string;
    welcome: string;
    experience: string;
    flag: string;
    isRTL: boolean;
  };
  selected: boolean;
  onPress: () => void;
}) => {
  const { actionOpacity, animateOpacity } = constants;

  const borderClass = selected
    ? "border-[1.5px] border-secondary-blue"
    : "border border-shades-gray-06";
  const layoutDirection = item?.isRTL ? "flex-row-reverse" : "flex-row";
  const textAlignItems = item?.isRTL ? "items-end" : "items-start";
  const bgColor = selected ? "bg-shades-blue-06" : "bg-secondary-white";
  // const { userType, theme, updateUserPreferences, isTWKTokenValid } = useUserPreferenceStore();

  // const twkToken = generateTWKToken();
  // const { mutateAsync: verifyTwkToken } = useVerifyTWKToken(twkToken);

  // useEffect(() => {
  //     verifyTwkToken({
  //       full_name: "محمد عبدالعزيز",
  //       mobile_number: "+966533978938",
  //       email: "sam070120361@example.com",
  //       language: "en"
  //     }).then((res) => {
  //       console.log("TWK Token verification response", res);
  //       if(res?.token){
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: res.token})
  //       }
  //       else {
  //         // Temp to complete the implementation, Add the working bearer token here to test the flow until the TWK token is working from backend 
  
  //         // updateUserPreferences({isTWKTokenValid: false, accessToken: null})
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjVjZTQwMTAtMzAxNy0xMWYxLTgxMDEtODVmZDgwY2QwMDgyIiwibmFtZSI6InJlZmVycnIiLCJpc011bHRpbGluZSI6dHJ1ZX0sImlhdCI6MTc3NTM2OTY5MywiZXhwIjoxNzgwNTUzNjkzfQ.kXhtxjOfymGK2ROhcDb3B8BGkLNxy1NCPIkXGRrmjiU'})
  //       }
  //     }).catch((err) => {
  //       console.log("TWK Token verification failed", err);
  //               // Temp to complete the implementation, Add the working bearer token here to test the flow until the TWK token is working from backend
  
  //       // updateUserPreferences({isTWKTokenValid: false, accessToken: null})
  //         updateUserPreferences({isTWKTokenValid: true, accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjVjZTQwMTAtMzAxNy0xMWYxLTgxMDEtODVmZDgwY2QwMDgyIiwibmFtZSI6InJlZmVycnIiLCJpc011bHRpbGluZSI6dHJ1ZX0sImlhdCI6MTc3NTM2OTY5MywiZXhwIjoxNzgwNTUzNjkzfQ.kXhtxjOfymGK2ROhcDb3B8BGkLNxy1NCPIkXGRrmjiU'})
  
  //     });
  // }, [isTWKTokenValid, verifyTwkToken]);

  return (
    <Pressable
      className={`flex-1 rounded-xl p-4 gap-6 ${bgColor} ${borderClass} ${actionOpacity} ${animateOpacity}`}
      onPress={onPress}
    >
      <View className={`justify-between items-center ${layoutDirection}`}>
        <GenericImage
          uri={item?.flag}
          width="w-[30px]"
          height=""
          className="aspect-[5/4]"
        />
        <CustomText
          className={`font-primary-medium text-base text-secondary-gray`}
        >
          {item?.label}
        </CustomText>
      </View>
      <View className={`gap-1 ${textAlignItems}`}>
        <CustomText
          dir={item?.isRTL ? "rtl" : "ltr"}
          className={`font-primary-medium text-sm text-secondary-gray`}
        >
          {item?.welcome}
        </CustomText>
        <CustomText
          className={`font-primary-regular text-xs text-shades-gray-02`}
        >
          {item?.experience}
        </CustomText>
      </View>
    </Pressable>
  );
};

const LanguageSelection: React.FC = () => {
  const { t, getCurrentLocale } = useAppTranslation();
  const { toggleLanguage } = useLanguageToggle();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageType>("English");
  const navigation = useNavigation();
  const { setNavigationState, hasCompletedLanguageSelection } =
    useUserNavigationStore();
  const [shouldShowUI, setShouldShowUI] = useState(false);

  useEffect(() => {
    setShouldShowUI(!hasCompletedLanguageSelection);
  }, [hasCompletedLanguageSelection, setNavigationState]);

  const langCardsArr = [
    {
      lang: "Arabic",
      label: t("label.arabic"),
      welcome: t("label.welcomeAlt"),
      experience: t("label.experienceYaqootAlt"),
      flag: require("../../public/images/arabic-flag.webp"),
      isRTL: true,
    },
    {
      lang: "English",
      label: t("label.english"),
      welcome: t("label.welcome"),
      experience: t("label.experienceYaqoot"),
      flag: require("../../public/images/english-flag.webp"),
      isRTL: false,
    },
  ];

  const handleContinue = async () => {
    const selectedLocale = selectedLanguage === "Arabic" ? "ar" : "en";
    setNavigationState({ hasCompletedLanguageSelection: true });

    if (getCurrentLocale() !== selectedLocale) {
      await toggleLanguage(true, selectedLocale); // reloadAsync is already inside toggleLanguage
      if (Platform.OS === "web") {
        navigation.popToTop();
      }
      return; // exit early as reload will refresh the app
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "tabs" }],
    });
  };
  if (!shouldShowUI) {
    navigation.reset({
      index: 0,
      routes: [{ name: "tabs" }],
    });
  }

  return (
    <View className="flex-1 bg-secondary-white p-5">
      <View className="flex-1 items-center mb-5">
        <View className="flex-[1.5] items-center justify-end">
          <GenericImage
            uri={require("../../public/images/choose-language-logo.webp")}
            width="w-[300px]"
            height=""
            className="aspect-[1/1]"
          />
        </View>
        <View className="flex-1 justify-center items-center w-full">
          <CustomText
            className={`font-primary-bold text-lg text-secondary-gray w-full`}
          >
            Choose your language for a personalized Yaqoot experience.
          </CustomText>
          <View className="mt-6 flex-row w-full gap-4">
            {langCardsArr?.map((card, index) => (
              <LanguageOptionCard
                key={index}
                item={card}
                selected={selectedLanguage === card?.lang}
                onPress={() => setSelectedLanguage(card?.lang)}
              />
            ))}
          </View>
        </View>
      </View>
      <CustomButton
        containerClassName="mb-[20px]"
        label="Continue"
        onPress={handleContinue}
      />
    </View>
  );
};

export default LanguageSelection;

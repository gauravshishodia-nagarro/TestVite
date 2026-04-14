import { useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import FadeOnFocusView from '../../components/fadeOnFocusView';
import Section from '../../components/section';
import SectionItem from '../../components/sectionItem';
import constants from '../../configs/constants';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';

const AppPreferences = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { t } = useAppTranslation();
  const { language } = useUserPreferenceStore();
  const { setActiveSheet } = useBottomSheetStore();
  const { fontPrimaryRegular } = constants;
  const navigation = useNavigation();

  const onLanguageChange = () => {
    setActiveSheet('languageSelectionSheet', { enableDynamicSizing: true, snapPoints: undefined });
  };

  const onPressAppPreferences = () => {
    navigation.navigate('appPreferences' as never);
  }

  return (
    <Section
      label={'General Settings'}
      containerClassName="!mt-4"
      labelClassName={`!text-xs text-shades-gray-03 ${fontPrimaryRegular}`}
    >
      <SectionItem
        leadingIcon="/images/app_preferences.webp"
        label={'App Preferences'}
        imageWidth='w-[26px]'
        imageHeight='h-[26px]'
        containerClassName="!py-0 !mt-6"
        dividerClassName="!mt-4"
        onPress={onPressAppPreferences}
      />

      {/* <SectionItem
        leadingIcon="changeLanguage"
        label={t('action.changelanguage')}
        trailingText={language === 'ar' ? 'العربية' : 'English'}
        showSperator
        containerClassName="!py-0 !mt-6"
        dividerClassName="!mt-4"
        onPress={onLanguageChange}
      /> */}
      {/* <SectionItem
        leadingIcon="notification2"
        label={t('label.notifications')}
        trailingSwitch
        isSwitchOn={notificationsEnabled}
        onTrailingSwitchPress={(value) => setNotificationsEnabled(value)}
        containerClassName="!py-0 !mt-4"
        showFallabackArrow={false}
      /> */}
    </Section>
  );
};

const HelpAndSupport = () => {
  const { t } = useAppTranslation();
  const navigation = useNavigation<NavigationProp<any>>();
  const { fontPrimaryRegular } = constants;


  return (
    <Section
      label={t('label.helpAndSupport')}
      containerClassName="!mt-4"
      labelClassName={`!text-xs text-shades-gray-03 ${fontPrimaryRegular}`}
    >
      <SectionItem
        leadingIcon="faq"
        label={t('label.helpCenter')}
        showSperator
        containerClassName="!py-0 !mt-6"
        dividerClassName="!mt-4"
        onPress={() => navigation.navigate('help')}
      />
      <SectionItem
        leadingIcon="privacy"
        label={t('action.privacyPolicy')}
        showSperator
        containerClassName="!py-0 !mt-4"
        dividerClassName="!mt-4"
        onPress={() => Linking.openURL('https://yaqoot.sa/en/privacy')}
      />
      <SectionItem
        leadingIcon="terms"
        label={t('action.termsConditions')}
        containerClassName="!py-0 !mt-4"
        onPress={() => Linking.openURL('https://yaqoot.sa/en/terms')}
      />
    </Section>
  );
};

const SettingsScreen = () => {
  const { tabScreenBottomPadding } = constants;

  return (
    <FadeOnFocusView>
      <View className="flex-1 bg-shades-purple-06">
        <ScrollView
          className="mx-5 py-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabScreenBottomPadding }}
        >
          <AppPreferences />
          <HelpAndSupport />
        </ScrollView>
      </View>
    </FadeOnFocusView>
  );
};

export default SettingsScreen;

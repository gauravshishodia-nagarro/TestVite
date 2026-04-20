import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import FadeOnFocusView from '../../components/fadeOnFocusView';
import Section from '../../components/section';
import SectionItem from '../../components/sectionItem';
import constants from '../../configs/constants';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';
import CustomText from '../../components/customText';
import GenericImage from '../../components/image';

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
        imageWidth='w-[22px]'
        imageHeight='h-[22px]'
        containerClassName="!py-0 !mt-6 !mb-2 !mx-1"
        dividerClassName="!mt-4"
        onPress={onPressAppPreferences}
      />
    </Section>
  );
};

const HelpAndSupport = () => {
  const { t } = useAppTranslation();
  const navigation = useNavigation<NavigationProp<any>>();
  const { fontPrimaryRegular } = constants;

  const trailing = () => {
    return (<View><GenericImage height='h-[22px]' width='w-[22px]' resizeMode='contain' className='h-[22px] w-[22px]' uri={require("/images/open_link.webp")} /></View>)
  }


  return (
    <Section
      label={t('label.helpAndSupport')}
      containerClassName="!mt-4"
      labelClassName={`!text-xs text-shades-gray-03 ${fontPrimaryRegular}`}
    >
      <SectionItem
        leadingIcon="privacy"
        label={t('action.privacyPolicy')}
        showSperator
        containerClassName="!py-0 !mt-6 !pb-2 !mx-1"
        trailing={trailing()}
        dividerClassName="!mt-4"
        onPress={() => Linking.openURL('https://yaqoot.sa/en/privacy')}
      />
      <SectionItem
        leadingIcon="terms"
        label={t('action.termsConditions')}
        trailing={trailing()}
        containerClassName="!py-0 !mt-6 !mb-2 !mx-1"
        onPress={() => Linking.openURL('https://yaqoot.sa/en/terms')}
      />
    </Section>
  );
};

const MoreHelp = () => {
  return (<View className='bg-secondary-blue p-4 rounded-[12px] mt-6'>
    <CustomText fontVarient='bold' className='text-[18px] text-secondary-gray'>Need More help?</CustomText>
    <CustomText fontVarient='regular' className='text-[14px] text-shades-gray-02 mt-1'>Couldn’t find what you are looking for, reach us</CustomText>
    <Pressable>
      <GenericImage height='h-[22px]' width='w-[22px]' resizeMode='contain' className='h-[22px] w-[22px]' uri={require("/images/call.webp")} />
    </Pressable>
  </View>)
}

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
          <MoreHelp />
        </ScrollView>
      </View>
    </FadeOnFocusView>
  );
};

export default SettingsScreen;

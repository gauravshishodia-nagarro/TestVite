import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import FadeOnFocusView from '../../components/fadeOnFocusView';
import Section from '../../components/section';
import SectionItem from '../../components/sectionItem';
import CustomText from '../../components/customText';
import constants from '../../configs/constants';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';

const AppPreferencesScreen = () => {
	const { fontPrimaryBold, fontPrimaryRegular, tabScreenBottomPadding } = constants;
	const { language } = useUserPreferenceStore();
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const { setActiveSheet } = useBottomSheetStore();
	const { t } = useAppTranslation();

	const onLanguagePress = () => {
		setActiveSheet('languageSelectionSheet', { enableDynamicSizing: true, snapPoints: undefined });
	};

	return (
		<FadeOnFocusView>
			<View className="flex-1 bg-shades-purple-06">
				<ScrollView
					className="mx-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: tabScreenBottomPadding }}
				>
					<CustomText className={`text-secondary-gray text-2xl ${fontPrimaryBold} mt-6`}>
						{t('label.makeYourPreferences')}
					</CustomText>
					<CustomText className={`text-shades-gray-02 text-sm ${fontPrimaryRegular} mt-1`}>
						{t('label.setPreferencesSubtitle')}
					</CustomText>

					<Section containerClassName="!mt-4" label="">
						<SectionItem
							leadingIcon="changeLanguage"
							label={t('label.preferredLanguage')}
							trailingText={language === 'ar' ? 'العربية' : 'English'}
							// containerClassName="!py-0 !my-4"
							// dividerClassName="!mt-4"
							onPress={onLanguagePress}
						/>
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
				</ScrollView>
			</View>
		</FadeOnFocusView>
	);
};

export default AppPreferencesScreen;

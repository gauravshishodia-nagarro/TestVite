import React, { useState } from 'react';
import { View } from 'react-native';
import CustomButton from '../components/customButton';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import RadioButton from '../components/radioButton';
import constants from '../configs/constants';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useLanguageToggle } from '../hooks/useLanguageToggle';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { setAccessibilityProps } from '../types';
import GenericImage from '../components/genericImage';

export type LanguageSelectionSheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
};

const languageOptions = [
	{ code: 'en', nameKey: 'label.english', subLabelKey: 'label.englishSubLabel', flag: require('/images/english-flag.webp') },
	{ code: 'ar', nameKey: 'label.arabic', subLabelKey: 'label.arabicSubLabel', flag: require('/images/arabic-flag.webp') },
];

const LanguageSelectionSheet: React.FC<LanguageSelectionSheetProps> = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
	const { nativeID = 'language_selection_sheet', accessibilityLabel }: LanguageSelectionSheetProps =
		bottomSheetOptions.props || {};
	const { fontPrimaryMedium, fontPrimaryBold, fontPrimaryRegular } = constants;
	const { language } = useUserPreferenceStore();
	const [selectedLanguage, setSelectedLanguage] = useState(language);
	const { toggleLanguage } = useLanguageToggle();
	const { t } = useAppTranslation();

	const handleSave = async () => {
		useBottomSheetStore.getState().setActiveSheet(null);
		if (selectedLanguage !== language) {
			await toggleLanguage(false, selectedLanguage);
		}
	};

	return (
		<View
			className="bg-shades-purple-06 pb-8 px-5"
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			<CustomText className={`text-secondary-gray text-2xl ${fontPrimaryBold}`}>
				{t('label.preferredLanguage')}
			</CustomText>
			<CustomText className={`text-shades-gray-02 text-sm ${fontPrimaryRegular} mt-2`}>
				{t('label.selectAppLanguage')}
			</CustomText>

			<View className="bg-secondary-white mt-6 rounded-xl px-4 py-2">
				{languageOptions.map((lang, index) => (
					<React.Fragment key={lang.code}>
						{index > 0 && <Divider containerClassName="!bg-shades-purple-06" />}
						<RadioButton
							label=""
							labelView={
								<View className="flex-row items-center gap-3 flex-1 py-3">
										<GenericImage uri={lang.flag} className='w-[25px] h-[18px]' height='h-[18px]' width='w-[25px]' resizeMode='contain' />
									<View className="flex-1 gap-[2px]">
										<CustomText className={`text-base text-secondary-gray ${fontPrimaryBold}`}>
											{t(lang.nameKey)}
										</CustomText>
										<CustomText className={`text-xs text-shades-gray-02 ${fontPrimaryRegular}`}>
											{t(lang.subLabelKey)}
										</CustomText>
									</View>
								</View>
							}
							selected={selectedLanguage === lang.code}
							onPress={() => setSelectedLanguage(lang.code as 'en' | 'ar')}
						/>
					</React.Fragment>
				))}
			</View>

			<CustomButton
				containerClassName="mt-6"
				label={t('button.saveChanges')}
				onPress={handleSave}
			/>
		</View>
	);
};

export default LanguageSelectionSheet;

import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Badge from '../components/badge';
import CustomButton from '../components/customButton';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import GenericImage from '../components/image';
import NumberLabelItem from '../components/numberLabelItem';
import PriceWithCurrencey from '../components/priceWithCurrencey';
import constants from '../configs/constants';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { PackageType } from '../apis/types/store';
import { setAccessibilityProps } from '../types';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';

export type ActivateESIMInfoSheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	msisdn?: string;
	selectedPackage?: PackageType;
	onGotIt?: () => void;
};

const ActivateESIMInfoSheet: React.FC = () => {
	const { height: windowHeight } = useWindowDimensions();
	// Sheet is 80% height; subtract handle indicator (~28px) + SheetHeader (~48px)
	const scrollViewHeight = windowHeight * 0.8 - 28 - 48;

	const { bottomSheetOptions } = useBottomSheetStore();
	const {
		nativeID = 'activate_esim_info_sheet',
		accessibilityLabel,
		msisdn,
		selectedPackage,
		onGotIt,
	}: ActivateESIMInfoSheetProps = bottomSheetOptions.props || {};

	const { fontPrimaryBold, fontPrimaryMedium, fontPrimaryRegular } = constants;
	const { t } = useAppTranslation();
	const { theme } = useUserPreferenceStore();

	const pkg = selectedPackage?.esimPackage ?? selectedPackage;
	const packageName = pkg?.name ?? '';
	const packageLogo = pkg?.package_logo_image ?? '';
	const price = pkg?.price_tax ?? 0;

	const steps = [
		t('label.esimActivateStep1'),
		t('label.esimActivateStep2'),
		t('label.esimActivateStep3'),
	];

	const handleGotIt = () => {
		useBottomSheetStore.getState().setActiveSheet(null);
	};

	return (
		<View
			className="bg-shades-purple-06 flex-1"
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			<BottomSheetScrollView
				showsVerticalScrollIndicator={false}
				style={{ height: scrollViewHeight }}
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
			>
				<View className="items-center mt-4 mb-4">
					<View className="w-[90px] h-[90px] rounded-full bg-secondary-white items-center justify-center">
						<GenericImage
							uri={require('../../public/images/activate-esim.webp')}
							width="w-[64px]"
							height="h-[64px]"
							resizeMode="contain"
						/>
					</View>
				</View>

				<CustomText className={`text-secondary-gray text-xl text-center ${fontPrimaryBold}`}>
					{t('label.activateeSIM')}
				</CustomText>
				<CustomText className={`text-shades-gray-02 text-sm text-center mt-1 ${fontPrimaryRegular}`}>
					{t('label.checkDetailsForESIM')}
				</CustomText>

				<View className="bg-secondary-white rounded-xl mt-6 px-4 py-4">
					<View className="flex-row items-center justify-between">
						<View className="gap-2 flex-1">
							<View className="flex-row items-center gap-3">
								{packageLogo ? (
									<GenericImage
										uri={packageLogo}
										width="w-[64px]"
										height="h-[48px]"
										resizeMode="contain"
									/>
								) : (
									<View className="w-[64px] h-[48px] bg-shades-purple-06 rounded-md" />
								)}
								<CustomText className={`text-sm text-secondary-gray ${fontPrimaryMedium}`}>
									{packageName || t('label.voicePackage')}
								</CustomText>
							</View>
							<View className="flex-row items-center gap-2">
								{msisdn ? (
									<Badge
										label={msisdn}
										textColorClassName="text-secondary-gray"
										bgColorClassName="bg-shades-gray-06"
										containerClassName="!rounded-[20px] !px-3 !py-1"
									/>
								) : null}
								<Badge
									label="eSIM"
									textColorClassName="text-secondary-gray"
									bgColorClassName="bg-shades-gray-06"
									containerClassName="!rounded-[20px] !px-3 !py-1"
								/>
							</View>
						</View>
						<PriceWithCurrencey
							price={price}
							bgColor={Colors[theme].secondaryGreen}
							customTextClassName={`text-sm text-secondary-green ${fontPrimaryMedium}`}
						/>
					</View>
				</View>

				<View className="bg-secondary-white rounded-xl mt-4 px-4 py-4">
					<CustomText className={`text-sm text-secondary-gray mb-4 ${fontPrimaryMedium}`}>
						{t('label.followStepsToActivate')}
					</CustomText>
					<Divider containerClassName="mb-4 !bg-shades-purple-06" />
					<NumberLabelItem
						list={steps}
						containerClassName="gap-1"
						labelFontName={fontPrimaryRegular}
						labelClassName="text-shades-gray-01 text-xs"
					/>
				</View>
				{/* CTA */}
				<CustomButton
					containerClassName="mt-6"
					label={t('button.gotIt')}
					onPress={handleGotIt}
				/>
			</BottomSheetScrollView>
		</View>
	);
};

export default ActivateESIMInfoSheet;

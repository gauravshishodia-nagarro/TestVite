import React from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import CustomText from '../components/customText';
import GenericImage from '../components/image';
import Loader from '../components/loader';
import SVGIcon from '../components/svgIcon';
import constants from '../configs/constants';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { setAccessibilityProps } from '../types';
import { maskPhoneNumber, isRTL } from '../utils/formatter';
import { useAppTranslation } from '../hooks/useAppTranslation';

export type MobileNumberVerificationSheetProps = {
	number: string;
	onSendCodePress: () => void;
	onVerifyWithNafathPress: () => void;
	nativeID?: string;
	accessibilityLabel?: string;
	containerClassName?: string;
	loading?: boolean;
};

const MobileNumberVerificationSheet: React.FC = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
	const {
		number = '',
		onSendCodePress,
		onVerifyWithNafathPress,
		nativeID = 'mobile_number_verification_sheet',
		accessibilityLabel,
		containerClassName = '',
		loading = false,
	}: MobileNumberVerificationSheetProps = bottomSheetOptions.props;
	const { fontPrimaryBold, fontPrimaryRegular, fontPrimaryMedium } = constants;
const {t} = useAppTranslation();
	const openNafath = async () => {
		if (Platform.OS === 'web') return;
		const link =
			Platform.OS === 'android'
				? 'https://play.google.com/store/apps/details?id=sa.gov.nic.myid'
				: 'https://apps.apple.com/qa/app/نفاذ-nafath/id1598909871';
		try {
			const supported = await Linking.canOpenURL(link);

			if (supported) {
				await Linking.openURL(link);
			}
		} catch (e) {
			console.warn('Failed to open Nafath', e);
		}
	};

	return (
		<View
			className={`py-10 px-5 ${containerClassName} gap-6`}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			<GenericImage
				uri={require('../../public/images/verify-number.webp')}
				width="w-[131px]"
				height="h-[124px]"
				className="self-center"
			/>
			<View className="gap-1">
				<CustomText
					className={`text-xl text-secondary-gray text-left text-start ${fontPrimaryBold}`}
				>
					{t('label.verifyYourInformation')}
				</CustomText>
				<CustomText
					className={`text-base text-shades-gray-01 text-left text-start ${fontPrimaryRegular}`}
				>
					{t('label.selectVerifyMethod')}
				</CustomText>
			</View>
			<View className="gap-3">
				<Pressable
					className="bg-secondary-white p-4 rounded-xl"
					onPress={onSendCodePress}
				>
					<View className="flex-row items-center justify-center">
						<SVGIcon
							name={'verfiyPhone'}
							height={32}
							width={32}
							viewBox="0 0 32 32"
						/>
						<View className="flex-1 gap-1 mx-3">
							<CustomText
								className={`text-sm text-secondary-gray text-left text-start ${fontPrimaryMedium}`}
							>
								{t('label.veriyUsingPhone')}
							</CustomText>
							<CustomText
								className={`text-xs text-shades-gray-03 ${fontPrimaryRegular}`}
							>
								{t('label.codeWillBeSendTo')}
								<CustomText
									className={`text-secondary-blue ${fontPrimaryBold}`}
								>
									{` ${maskPhoneNumber(number)}`}
								</CustomText>
								<CustomText>
									{` ${t('label.mustBeLinkedWithNationID')}`}
								</CustomText>
							</CustomText>
						</View>
						<View className={`${isRTL() ? 'rotate-180' : ''}`}>
							<SVGIcon
								name={'arrow'}
								width={24}
								height={24}
								viewBox="0 0 24 24"
							/>
						</View>
					</View>
				</Pressable>

				<Pressable
					className="bg-secondary-white p-4 rounded-xl"
					onPress={onVerifyWithNafathPress}
				>
					<View className="flex-row items-center justify-center">
						<GenericImage
							uri={require('../../public/images/nafath.webp')}
							className="aspect-[1/1]"
							width="w-[40px]"
							resizeMode="contain"
						/>
						<View className="flex-1 gap-1 mx-3">
							<CustomText
								className={`text-sm text-secondary-gray  ${fontPrimaryMedium}`}
							>
								{t('label.verifyUsingNafath')}
							</CustomText>
							<CustomText
								className={`text-xs text-shades-gray-03 ${fontPrimaryRegular}`}
							>
								{t('label.dontHaveNafathApp')}
								<CustomText
									className={
										Platform.OS !== 'web'
											? `text-secondary-blue ${fontPrimaryBold}`
											: ''
									}
									onPress={openNafath}
								>
									{Platform.OS === 'web'
										? t('label.downloadWeb')
										: Platform.OS === 'android'
											? t('label.downloadPlayStore')
											: t('label.downloadAppStore')}
								</CustomText>
							</CustomText>
						</View>
						<View className={`${isRTL() ? 'rotate-180' : ''}`}>
							<SVGIcon
								name={'arrow'}
								width={24}
								height={24}
								viewBox="0 0 24 24"
							/>
						</View>
					</View>
				</Pressable>

				{/* <CustomText
					className={`text-sm text-secondary-gray text-left text-start ${fontPrimaryRegular}`}
				>
					{t('label.codeWillBeSendTo')}
					<CustomText className={`text-secondary-blue ${fontPrimaryBold}`}>
						{` ${maskPhoneNumber(number)}`}
					</CustomText>
				</CustomText>
				<Text
					className={`text-sm text-secondary-gray text-left text-start ${fontPrimaryRegular}`}
				>
					{t('label.mustBeLinkedWithNationID')}
				</Text>
				<CustomButton
					containerClassName="mt-4"
					label={t('button.sendCode')}
					onPress={() => {
						onSendCodePress?.();
					}}
				/>
				<View className="justify-center items-center my-6 flex-row">
					<View className="h-[1px] bg-shades-gray-06 flex-1" />
					<Text className={`mx-4 text-shades-gray-01 ${fontPrimaryRegular}`}>
						{t('label.or')}
					</Text>
					<View className="h-[1px] bg-shades-gray-06 flex-1" />
				</View>
				<CustomButton
					label={t('button.verifyWithNafath')}
					onPress={() => {
						onVerifyWithNafathPress?.();
					}}
					type="outlined"
				/> */}
			</View>
			<Loader loading={loading} />
		</View>
	);
};

export default MobileNumberVerificationSheet;

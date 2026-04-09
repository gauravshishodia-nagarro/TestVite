import { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import OTPInput from '../components/otpInput';
import Timer from '../components/timer';

import CustomText from '../components/customText';
import SheetLoadingView from '../components/sheetLoadingView';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { isRTL } from '../utils/formatter';
import { useAppTranslation } from '../hooks/useAppTranslation';

const OTPBottomSheet: React.FC = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
		const { t: strings } = useAppTranslation();

	const {
		isPhone = true,
		numberOfInputs = 6,
		onOTPFilled,
		identifier = '05 ***  12412',
		resendOTP,
		initialTimeInSecond = 120,
		showLoading = false,
		loadingText = strings('label.verifying'),
	} = bottomSheetOptions.props;
	const { fontPrimaryRegular, fontPrimaryMedium, fontPrimaryBold } = constants;
	const [seconds, setSeconds] = useState<number>(initialTimeInSecond);
	const [enableResend, setEnableResend] = useState<boolean>(false);
	const [otpInputKey, setOtpInputKey] = useState(0);
	const { theme } = useUserPreferenceStore();
	useEffect(() => {
		if (seconds === 0) {
			setEnableResend(true);
		}
	}, [seconds]);

	if (showLoading)
		return (
			<SheetLoadingView
				nativeID="otp_bottom_sheet_loading"
				accessibilityLabel="OTP Bottom Sheet Loading"
				indicatorColor={Colors[theme].secondaryBlue}
				label={loadingText}
				className={Platform.OS === 'web' ? 'flex-1' : ''}
			/>
		);

	return (
		<View className="px-5 pb-10 bg-shades-purple-06 flex-1">
			{/* <View className="flex-row gap-4 items-center pb-1">
				{Platform.OS === 'web' && (
					<Pressable
						onPress={() => {
							setWebModalVisible(false);
						}}
						className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity}`}
					>
						<View className={`${isRTL() ? 'rotate-180' : ''}`}>
							<SVGIcon
								name={'back'}
								width={24}
								height={24}
								stroke={Colors[theme].black}
							/>
						</View>
					</Pressable>
				)}
				<CustomText
					className={`pb-1 text-secondary-gray text-xl text-left text-start ${fontPrimaryBold}`}
				>
					{strings('common.verification')}
				</CustomText>
			</View> */}
			<View className="py-1 flex flex-row">
				<CustomText
					className={`text-secondary-gray text-base ${fontPrimaryRegular}`}
				>
					{strings('common.codeSentToThe')}
				</CustomText>
				<CustomText
					className={`text-secondary-gray text-base ${fontPrimaryRegular}`}
				>
					{strings(isPhone ? 'common.phoneNumber' : 'common.email')}
				</CustomText>
			</View>
			<CustomText
				className={`pb-8 text-secondary-blue text-sm text-left ${fontPrimaryBold} ${Platform.OS === 'web' && isRTL() ? 'text-right' : 'text-left'}`}
			>
				{identifier}
			</CustomText>
			<OTPInput
				key={otpInputKey}
				numberOfInputs={numberOfInputs}
				onFilled={onOTPFilled}
			/>
			<View className="pt-8">
				<Timer seconds={seconds} setSeconds={setSeconds} />
				<View className="pt-3 flex flex-row justify-center">
					<CustomText
						className={`text-shades-gray-02 text-sm ${fontPrimaryRegular}`}
					>
						{strings('common.didNotReceiveCode')}
					</CustomText>
					<TouchableOpacity
						disabled={!enableResend}
						onPress={() => {
							setSeconds(initialTimeInSecond);
							setEnableResend(false);
							setOtpInputKey((k) => k + 1); // clear OTP inputs on resend
							resendOTP?.();
						}}
					>
						<CustomText
							className={`${enableResend ? 'text-secondary-blue' : 'text-secondary-blue/40'} text-sm ${fontPrimaryMedium}`}
						>
							{strings('button.resendCode')}
						</CustomText>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default OTPBottomSheet;

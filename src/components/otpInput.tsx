import { setAccessibilityProps } from '../types';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useRef, useState, useEffect } from 'react';
import {
	NativeSyntheticEvent,
	Platform,
	TextInput,
	TextInputKeyPressEventData,
	View,
} from 'react-native';
import constants from '../configs/constants';
import { arabicToEnglishDigits } from '../utils/formatter';

interface OTPInputProps {
	numberOfInputs?: number;
	onFilled: (code: string) => void;
	containerClassName?: string;
	inputClassName?: string;
	nativeID?: string;
	accessibilityLabel?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
	numberOfInputs = 6,
	onFilled,
	containerClassName = '',
	inputClassName = '',
	nativeID = 'otp_input',
	accessibilityLabel,
}) => {
	const inputRefs = useRef<(TextInput | null)[]>([]);
	const [otpValues, setOtpValues] = useState<string[]>(
		Array(numberOfInputs).fill(''),
	);

	useEffect(() => {
		const code = otpValues?.join('');
		if (code?.length === numberOfInputs) {
			onFilled?.(code);
		}
	}, [otpValues]);

	const handleChange = (text: string, index: number) => {
		const normalizedText = arabicToEnglishDigits(text);

		if (normalizedText?.length > 1) {
			// Paste handling
			const chars = normalizedText?.split('')?.slice(0, numberOfInputs);
			const newValues = Array(numberOfInputs)?.fill('');
			chars?.forEach((char, idx) => {
				newValues[idx] = char;
			});
			setOtpValues(newValues);
			const targetIndex = Math.min(chars?.length, numberOfInputs - 1);
			inputRefs.current[targetIndex]?.focus();
		} else {
			const newOtp = [...otpValues];
			newOtp[index] = normalizedText;
			setOtpValues(newOtp);
			if (normalizedText && index < numberOfInputs - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
		index: number,
	) => {
		if (e.nativeEvent.key === 'Backspace') {
			const newOtp = [...otpValues];

			if (otpValues[index] !== '') {
				newOtp[index] = '';
				setOtpValues(newOtp);
			} else if (index > 0) {
				inputRefs.current[index - 1]?.focus();
				newOtp[index - 1] = '';
				setOtpValues(newOtp);
			}
		}
	};
	const isWeb = Platform.OS === 'web';
	const InputComponent = isWeb ? TextInput : BottomSheetTextInput;

	return (
		<View className={`w-full ${containerClassName}`}>
			<View
				className={`flex flex-row justify-center items-center ${numberOfInputs === 6 ? (isWeb ? 'gap-4' : 'gap-2') : isWeb ? 'gap-6' : 'gap-4'}`}
			>
				{Array?.from({ length: numberOfInputs })?.map((_, index) => (
					<InputComponent
						key={index}
						ref={(ref) => (inputRefs.current[index] = ref)}
						value={otpValues[index]}
						onChangeText={(text) => handleChange(text, index)}
						onKeyPress={(e) => handleKeyPress(e, index)}
						keyboardType="number-pad"
						autoComplete={index === 0 ? 'one-time-code' : 'off'}
						maxLength={1}
						style={{
							textAlign: 'center',
							textAlignVertical: 'center', // Only works on Android
							direction: 'ltr',
							outline: 'none',
						}}
						className={`h-[52px] ${numberOfInputs === 6 ? (isWeb ? 'w-[10%]' : 'w-[14%] ps-[5.5%]') : isWeb ? 'w-[14%]' : 'w-[20%] ps-[8.5%]'} rounded-[12px] text-[20px] border bg-secondary-white ${constants.fontPrimaryMedium} ${constants.animateAll} text-center border-shades-gray-06 text-secondary-gray placeholder:text-shades-gray-05 focus:scale-110 ${inputClassName}`}
						{...setAccessibilityProps({
							nativeID: `${nativeID}_${index}`,
							accessibilityLabel: `${accessibilityLabel || 'OTP input'} ${index + 1}`,
							role: 'text',
						})}
					/>
				))}
			</View>
		</View>
	);
};

export default OTPInput;

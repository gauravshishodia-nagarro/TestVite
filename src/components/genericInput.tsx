import { setAccessibilityProps } from '../types';
import { ReactNode, useEffect, useRef } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { isRTL } from '../utils/formatter';
import InlineMsg from './inlineMsg';
import Label from './label';
import SVGIcon from './svgIcon';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface CustomInputProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	disabled?: boolean;
	shouldValidate?: boolean;
	isValid?: boolean;
	nativeID?: string;
	accessibilityLabel?: string;
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
	secureTextEntry?: boolean;
	error?: string;
	inputClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
	searchEnabled?: boolean;
	onSearchPress?: () => void;
	shouldFocus?: boolean;
	hideInlineView?: boolean;
	leadingView?: ReactNode;
	trailingView?: ReactNode;
	placeholderTextColor?: string;
	successView?: ReactNode;
	maxLength?: number;
	showErrorAsInfo?: boolean;
	onPressIn?: () => void;
	overrideDisableClassName?: boolean;
	leadingViewStyle?: object;
	isEmbedded?: boolean; // new prop to decide between TextInput and BottomSheetTextInput
	customInlineView?: ReactNode;
	hideValidationIcon?: boolean;
	injectedInputStyle?: object;
}
// This component supports both TextInput and BottomSheetTextInput based on the platform and isEmbedded prop. Ideally it will replace CustomInput in future.

export const GenericInput: React.FC<CustomInputProps> = ({
	label,
	placeholder = '',
	value,
	onChangeText,
	disabled = false,
	shouldValidate = true,
	nativeID = 'custom_input',
	accessibilityLabel,
	keyboardType = 'default',
	secureTextEntry = false,
	error = '',
	inputClassName = '',
	labelClassName = '',
	containerClassName = '',
	searchEnabled = false,
	onSearchPress,
	shouldFocus = true,
	hideInlineView = false,
	leadingView,
	trailingView,
	placeholderTextColor,
	successView,
	maxLength,
	showErrorAsInfo = false,
	onPressIn,
	overrideDisableClassName = false,
	leadingViewStyle = {},
	isEmbedded = false,
	customInlineView = null,
	hideValidationIcon = false,
	injectedInputStyle = {},
}) => {
	const inputRef = useRef<TextInput>(null);
	const bottomSheetInputRef = useRef<any>(null);

	const { animateColors, fontPrimaryMedium } = constants;
	const { theme } = useUserPreferenceStore();

	// Only auto-focus TextInput, not BottomSheetTextInput
	useEffect(() => {
		if (shouldFocus && !isEmbedded) {
			inputRef.current?.focus();
		}
	}, [shouldFocus, isEmbedded]);

	const showAsError = () => {
		if (showErrorAsInfo && error.length > 0) {
			return false;
		}
		return error.length > 0;
	};

	// Decide input component ONCE
	const InputComponent =
		Platform.OS !== 'web' && isEmbedded ? BottomSheetTextInput : TextInput;

	return (
		<View className={`w-full ${containerClassName}`}>
			{label && <Label label={label} labelClassName={labelClassName} />}

			<View className="flex justify-center items-center">
				{/* Validation Icon */}
				{shouldValidate && (
					<View
						pointerEvents="none"
						style={{
							...StyleSheet.absoluteFillObject,
							top: '35%',
							right: 14,
							left: 'auto',
						}}
						className="z-[1]"
					>
						{!(showErrorAsInfo || hideValidationIcon) && (
							<SVGIcon
								name={!!error ? 'corssMark2' : 'checkTick'}
								width={16}
								height={16}
								viewBox={!!error ? '0 0 17 16' : '0 0 17 10'}
							/>
						)}
					</View>
				)}

				{/* Search Icon */}
				{searchEnabled && (
					<View
						className={`absolute top-[35%] z-10 ${
							Platform.OS === 'web' && isRTL() ? 'left-4' : 'right-4'
						}`}
					>
						<SVGIcon
							name="search"
							width={20}
							height={20}
							viewBox="0 0 24 24"
							onPress={onSearchPress}
						/>
					</View>
				)}

				{/* Leading View */}
				{leadingView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: 14,
							justifyContent: 'center',
							alignItems: 'center',
							height: 48,
							...(Platform.OS === 'web' && isRTL()
								? { left: 'auto', right: 14 }
								: {}),
							...leadingViewStyle,
						}}
						className="z-[1]"
					>
						{leadingView}
					</View>
				)}

				{/* Trailing View */}
				{trailingView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 14,
							justifyContent: 'center',
							alignItems: 'center',
							height: 48,
							...(Platform.OS === 'web' && isRTL()
								? { right: 'auto', left: 14 }
								: {}),
						}}
						className="z-[1]"
					>
						{trailingView}
					</View>
				)}

				{/* Success View */}
				{successView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 38,
							justifyContent: 'center',
							alignItems: 'center',
							height: 48,
							...(Platform.OS === 'web' && isRTL()
								? { right: 'auto', left: 14 }
								: {}),
						}}
						className="z-[1]"
					>
						{successView}
					</View>
				)}

				{/* ACTUAL INPUT */}
				<InputComponent
					ref={isEmbedded ? bottomSheetInputRef : inputRef}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					editable={!disabled}
					onPressIn={onPressIn}
					keyboardType={keyboardType}
					secureTextEntry={secureTextEntry}
					selectionColor={'rgb(39, 38, 40)'}
					placeholderTextColor={
						placeholderTextColor || Colors[theme].shadesGray05
					}
					maxLength={maxLength}
					autoComplete="off"
					autoCorrect={false}
					textAlign={
						inputClassName.includes('text-center')
							? 'center'
							: isRTL()
								? 'right'
								: 'left'
					}
					className={`h-[55px] w-full ps-10 pe-14 py-4 ${fontPrimaryMedium} text-[16px]
            border-[1px] rounded-[28px] ${animateColors}
            bg-secondary-white border-shades-gray-06 text-secondary-gray
            placeholder:text-shades-gray-05
            ${disabled && !overrideDisableClassName ? '!border-shades-gray-04 !text-shades-gray-04' : ''}
            ${showAsError() ? '!border-secondary-ruby' : ''}
            ${inputClassName}`}
					style={[
						Platform.OS === 'android'
							? {
									includeFontPadding: false,
									textAlignVertical: 'center',
									paddingVertical: 0,
								}
							: { textAlignVertical: 'center', paddingVertical: 0 },
						injectedInputStyle,
					]}
					{...setAccessibilityProps({
						nativeID,
						accessibilityLabel: accessibilityLabel || label || placeholder,
						role: 'text',
					})}
				/>
			</View>

			{!hideInlineView &&
				(customInlineView || (
					<InlineMsg error={error} isInfo={showErrorAsInfo} />
				))}
		</View>
	);
};

export default GenericInput;

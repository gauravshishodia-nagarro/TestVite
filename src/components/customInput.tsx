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
}

const CustomInput: React.FC<CustomInputProps> = ({
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
}) => {
	const inputRef = useRef<TextInput>(null);
	const { animateColors, fontPrimaryMedium } = constants;
	const { theme } = useUserPreferenceStore();
	const hasValue = (value ?? '').length > 0;
	const displayError = hasValue && error ? error : '';

	useEffect(() => {
		if (shouldFocus) {
			inputRef.current?.focus();
		}
	}, [shouldFocus]);

	const showAsError = () => {
		if (showErrorAsInfo && displayError.length > 0) {
			return false;
		} else {
			return displayError.length > 0;
		}
	};

	return (
		<View className={`w-full ${containerClassName}`}>
			{label && <Label label={label} labelClassName={labelClassName} />}
			<View className="flex justify-center items-center">
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
						{!showErrorAsInfo && (
							<SVGIcon
								name={!!displayError ? 'corssMark2' : 'checkTick'}
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
						className={`absolute top-[35%] z-10 ${Platform.OS === 'web' && isRTL() ? 'left-4' : 'right-4'}`}
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

				{leadingView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: 14,
							justifyContent: 'center', // centers vertically
							alignItems: 'center', // centers horizontally if needed
							height: 48, // match TextInput height

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
				{trailingView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 14,
							justifyContent: 'center', // centers vertically
							alignItems: 'center', // centers horizontally if needed
							height: 48, // match TextInput height
							alignSelf: 'center', // centers vertically in parent

							...(Platform.OS === 'web' && isRTL()
								? { right: 'auto', left: 14 }
								: {}),
						}}
						className="z-[1]"
					>
						{trailingView}
					</View>
				)}
				{successView && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 38,
							justifyContent: 'center', // centers vertically
							alignItems: 'center', // centers horizontally if needed
							height: 48, // match TextInput height

							...(Platform.OS === 'web' && isRTL()
								? { right: 'auto', left: 14 }
								: {}),
						}}
						className="z-[1]"
					>
						{successView}
					</View>
				)}

				<TextInput
					textAlign={isRTL() ? 'right' : 'left'}
					ref={inputRef}
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
					className={`h-[55px] w-full ps-10 pe-14 py-4 ${fontPrimaryMedium} text-[16px] border-[1px] rounded-[28px] ${animateColors} bg-secondary-white border-shades-gray-06 text-secondary-gray placeholder:text-shades-gray-05 focus:outline-none 
            ${disabled && !overrideDisableClassName ? '!border-shades-gray-04 !text-shades-gray-04' : ''} 
            ${showAsError() ? '!border-secondary-ruby' : ''} ${inputClassName}
			text-start rtl:text-end`}
					autoComplete={'off'}
					autoCorrect={false}
					{...setAccessibilityProps({
						nativeID,
						accessibilityLabel: accessibilityLabel || label || placeholder,
						role: 'text',
					})}
					style={
						Platform.OS === 'android'
							? {
									includeFontPadding: false,
									textAlignVertical: 'center',
									paddingVertical: 0,
								}
							: { textAlignVertical: 'center', paddingVertical: 0 }
					}
					maxLength={maxLength}
				/>
			</View>
			{!hideInlineView && (
				<InlineMsg error={displayError} isInfo={showErrorAsInfo} />
			)}
		</View>
	);
};

export default CustomInput;

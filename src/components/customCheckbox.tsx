import { AnimatePresence, MotiView } from 'moti';
import React, { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import SVGIcon from './svgIcon';

type CustomCheckboxProps = {
	isChecked: boolean;
	onToggle: () => void;
	label?: string;
	nativeID?: string;
	accessibilityLabel?: string;
	labelClassName?: string;
	className?: string;
	trailingView?: ReactNode;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	isChecked,
	onToggle,
	label,
	nativeID = 'checkbox',
	accessibilityLabel,
	labelClassName = '',
	className = '',
	trailingView,
}) => {
	const { theme } = useUserPreferenceStore();
	const { actionOpacity } = constants;
	return (
		<Pressable
			onPress={onToggle}
			className={`flex-row items-center py-[8px] ${actionOpacity} ${className}`}
			{...setAccessibilityProps({
				nativeID,
				accessibilityLabel,
				role: 'checkbox',
			})}
		>
			{label && <Text className={`${labelClassName}`}>{label}</Text>}
			<MotiView
				from={{
					borderColor: Colors[theme].shadesGray05,
					backgroundColor: Colors[theme].secondaryWhite,
					scale: 1,
				}}
				animate={{
					borderColor: isChecked
						? Colors[theme].secondaryBlue
						: Colors[theme].shadesGray05,
					backgroundColor: isChecked
						? Colors[theme].secondaryBlue
						: Colors[theme].secondaryWhite,
					scale: isChecked ? 1.1 : 1,
				}}
				transition={{
					type: 'timing',
					duration: 300,
				}}
				className="w-[20px] h-[20px] border-[1.5px] rounded-md justify-center items-center"
			>
				<AnimatePresence>
					{isChecked && (
						<MotiView
							from={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
							transition={{ type: 'timing', duration: 200 }}
						>
							<SVGIcon
								name={'tick'}
								width={12}
								height={8}
								viewBox="0 0 17 13"
							/>
						</MotiView>
					)}
				</AnimatePresence>
			</MotiView>
			{trailingView && trailingView}
		</Pressable>
	);
};

export default CustomCheckbox;

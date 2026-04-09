import React from 'react';
import { View } from 'react-native';
import CustomText from '../components/customText';
import { setAccessibilityProps } from '../types';
import { Spinner } from './spinner';

type SheetLoadingViewProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	indicatorColor?: string;
	label?: string;
	className?: string;
};

const SheetLoadingView: React.FC<SheetLoadingViewProps> = ({
	nativeID,
	accessibilityLabel,
	indicatorColor,
	label,
	className = '',
}) => {
	return (
		<View
			className={`bg-shades-purple-06 pt-8 px-5 ${className}`}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			<View className="flex-row gap-2 pb-16">
				<Spinner indicatorColor={indicatorColor} />
				{label && (
					<CustomText
						fontVarient="bold"
						className="text-xl text-secondary-gray"
					>
						{label}
					</CustomText>
				)}
			</View>
		</View>
	);
};

export default SheetLoadingView;

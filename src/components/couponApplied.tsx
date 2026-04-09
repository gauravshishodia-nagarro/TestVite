import React from 'react';
import { View } from 'react-native';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import CustomText from './customText';
import SVGIcon from './svgIcon';
import { useAppTranslation } from '../hooks/useAppTranslation';

interface CouponAppliedViewProps {
	nativeID?: string;
	accessibilityLabel?: string;
	coupon: string;
	color?: string;
}

const CouponAppliedView: React.FC<CouponAppliedViewProps> = (props) => {
	const theme = useUserPreferenceStore((state) => state.theme);
	const { coupon, color = Colors[theme].secondaryYellow } = props;
	const { t: strings } = useAppTranslation();
	return (
		<View className="flex-row">
			<SVGIcon
				name="coupon"
				height={14}
				width={14}
				pathFill={color}
				viewBox="0 0 22 22"
			/>
			<CustomText
				fontVarient="medium"
				className="text-xs text-shades-gray-02 ms-1"
				style={{ color }}
			>
				<CustomText fontVarient="medium" className="text-xs" style={{ color }}>
					{coupon}{' '}
				</CustomText>
				{`${strings('common.couponApplied')}!!`}
			</CustomText>
		</View>
	);
};

export default CouponAppliedView;

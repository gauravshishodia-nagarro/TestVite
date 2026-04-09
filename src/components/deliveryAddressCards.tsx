import React, { ReactNode } from 'react';
import { Platform, Pressable, View } from 'react-native';
import constants from '../configs/constants';
import { setAccessibilityProps } from '../types';
import { isRTL } from '../utils/formatter';
import CustomText from './customText';
import SVGIcon from './svgIcon';
import { useAppTranslation } from '../hooks/useAppTranslation';

type DeliveryAddressCardProps = {
	editable?: boolean;
	title: string;
	onEditPress?: () => void;
	description: string;
	nativeID?: string;
	accessibilityLabel?: string;
	containerClassName?: string;
	titleTextClassName?: string;
	descriptionTextClassName?: string;
	showLabelView?: boolean;
	renderFooter?: ReactNode;
	showLeadingIcon?: boolean;
	titleLeadingView?: ReactNode;
};

const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({
	editable = true,
	title,
	onEditPress,
	description,
	nativeID = 'delivery_address',
	accessibilityLabel,
	containerClassName = '',
	titleTextClassName = '',
	descriptionTextClassName = '',
	showLabelView = true,
	renderFooter,
	showLeadingIcon = true,
	titleLeadingView,
}) => {
	const {
		fontPrimaryBold,
		fontPrimaryMedium,
		fontPrimaryRegular,
		actionOpacity,
		animateOpacity,
		animateColors,
	} = constants;

	const handleEditPress = () => onEditPress?.();
	const isRtl = isRTL();
	const {t} = useAppTranslation();

	return (
		<View
			className={`w-full bg-secondary-white rounded-xl p-4 gap-4 ${containerClassName} ${animateColors}`}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			{editable && showLabelView && (
				<View className="flex-row items-center">
					<CustomText
						className={`text-base text-secondary-gray flex-1 ${fontPrimaryBold} text-left ${Platform.OS === 'web' && isRtl ? 'text-end' : ''}`}
					>
						{t('label.deliveryAddress')}
					</CustomText>
					<SVGIcon
						style={{ marginTop: 2 }} // tailwind class not working so added inline styling
						name={'checkMark'}
						width={24}
						height={24}
						viewBox="0 0 20 20"
					/>
				</View>
			)}
			<View className="flex-row gap-1">
				{showLeadingIcon ? (
					<SVGIcon
						name={'currentLocation'}
						width={20}
						height={20}
						style={{ marginTop: 2 }}
					/>
				) : null}
				<View className="flex-1 flex-col">
					<View className="flex-row gap-2">
						{titleLeadingView}
						<CustomText
							className={`text-base text-secondary-gray text-left ${Platform.OS === 'web' && isRtl ? 'text-end' : ''} ${fontPrimaryBold} ${titleTextClassName}`}
						>
							{title}
						</CustomText>
					</View>
					<CustomText
						className={`text-sm text-secondary-gray text-left ${Platform.OS === 'web' && isRtl ? 'text-end' : ''} ${fontPrimaryRegular} ${descriptionTextClassName}`}
					>
						{description}
					</CustomText>
					{renderFooter}
				</View>
				{editable && (
					<Pressable
						onPress={handleEditPress}
						className={`${actionOpacity} ${animateOpacity}`}
					>
						<CustomText
							className={`text-base text-secondary-blue ${fontPrimaryMedium}`}
						>
							{t('button.edit')}
						</CustomText>
					</Pressable>
				)}
			</View>
		</View>
	);
};

export default DeliveryAddressCard;

import { LinearGradientProps } from 'expo-linear-gradient';
import { ReactNode, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { isRTL } from '../utils/formatter';
import Badge from './badge';
import CustomButton from './customButton';
import CustomText from './customText';
import GenericImage from './image';
import Section from './section';
import { DashedSeparator } from './separator';
import SVGIcon from './svgIcon';
import { useAppTranslation } from '../hooks/useAppTranslation';

type CouponCardProps = {
	showFooter?: boolean;
	applied: boolean;
	appliedText?: string;
	editable?: boolean;
	flowType?: 'autoRenew' | 'standard';
	couponCode: string;
	couponDescription: string | ReactNode;
	changeButtonType?: 'link' | 'button';
	showCheckIcon?: boolean;
	showSuccessText?: boolean;
	onPressChange: () => void;
	containerClassName?: string;
	appliedOnText?: string;
	footerContainerClassName?: string;
	onPressApply?: () => void;
};

export default function CouponCard({
	applied,
	appliedText,
	editable = true,
	flowType = 'standard',
	couponCode,
	couponDescription,
	showFooter,
	changeButtonType = 'button',
	showCheckIcon,
	showSuccessText,
	onPressChange,
	containerClassName,
	appliedOnText,
	footerContainerClassName,
	onPressApply,
}: CouponCardProps) {
	const theme = useUserPreferenceStore((state) => state.theme);
	const { animateAll } = constants;
	const gradientColors = [
		Colors[theme].primaryYellow,
		Colors[theme].secondaryYellow,
		Colors[theme].shadesYellow01,
	] as LinearGradientProps['colors'];
	const { t: strings } = useAppTranslation();

	const renderChangeBtn = useMemo(() => {
		if (changeButtonType === 'link') {
			return (
				<Pressable
					className={`active:scale-75 ${animateAll}`}
					onPress={onPressChange}
				>
					<CustomText
						fontVarient="medium"
						className="text-sm text-secondary-blue"
					>
						{strings('button.change')}
					</CustomText>
				</Pressable>
			);
		} else {
			return (
				<CustomButton
					size="small"
					type="outlined"
					onPress={onPressChange}
					label={strings('button.change')}
					containerClassName="!px-[10px]"
				/>
			);
		}
	}, [changeButtonType, animateAll, onPressChange]);

	const renderActionButtons = () => {
		if (editable) {
			return applied ? (
				renderChangeBtn
			) : (
				<CustomButton
					size="small"
					onPress={() => {
						onPressApply ? onPressApply() : null;
					}}
					label={strings('button.apply')}
				/>
			);
		}
	};

	const isRenewApply = flowType === 'autoRenew' && !applied;
	return (
		<Section
			isCustomLabel
			customLabel
			containerClassName={containerClassName ?? ''}
		>
			<View className="flex-row gap-3 justify-between items-center">
				{showCheckIcon ? (
					<SVGIcon name={'verified'} width={36} viewBox="0 0 18 12" />
				) : null}
				<View className="gap-1 flex-1">
					{showSuccessText && applied ? (
						<CustomText
							fontVarient="medium"
							className="text-xs text-secondary-green mb-1"
						>
							{appliedText || strings('label.couponApplied')}
						</CustomText>
					) : null}
					<View className="flex-row gap-2 items-center">
						{isRenewApply && (
							<GenericImage
								height="40"
								width="40"
								className="w-10 h-10"
								resizeMode="contain"
								uri={require('../../public/images/yaqoot-logo.webp')}
							/>
						)}
						<View className={` ${isRenewApply ? 'max-w-[70%]' : ''}`}>
							<View
								className={`flex-row gap-1 items-center ${showCheckIcon ? '-ms-2' : ''}`}
							>
								{isRenewApply ? null : (
									<GenericImage
										height="18"
										width="18"
										className="w-[18px] h-[18px]"
										uri={require('../../public/images/yaqoot-logo.webp')}
									/>
								)}
								<CustomText
									fontVarient="bold"
									className={`text-sm text-secondary-gray${isRenewApply ? ' text-base' : ''}`}
								>
									{couponCode}
								</CustomText>
								{isRenewApply && (
									<Badge
										gradientBadge
										gradientColors={gradientColors}
										textColorClassName="text-secondary-white text-[10.24px]"
										textFontVariant="medium"
										label={'15% OFF'}
										containerClassName="bg-secondary-yellow !px-2 !py-0 ms-2 !rounded-2xl"
									/>
								)}
							</View>

							<CustomText
								fontVarient="regular"
								className={`text-xs text-shades-gray-02 self-start ${showCheckIcon ? '-ms-2' : ''}`}
							>
								{couponDescription}
							</CustomText>
						</View>
					</View>

					{appliedOnText ? (
						<Badge
							textColorClassName="text-shades-gray-02"
							bgColorClassName="bg-shades-purple-06"
							containerClassName="border border-dashed border-shades-gray-06 mt-2 self-start"
							label={
								<CustomText
									fontVarient="regular"
									className="text-xxs text-shades-gray-02"
								>
									{strings('common.appliedOn')}
									<CustomText
										className="text-[10.24px] text-shades-gray-02"
										fontVarient="medium"
									>
										{' '}
										{appliedOnText}
									</CustomText>
								</CustomText>
							}
							iconName="coupon"
							iconProps={{
								stroke: Colors[theme].shadesGray02,
								pathFill: 'transparent',
								viewBox: '0 0 20 24',
								width: 16,
								height: 16,
							}}
						/>
					) : null}
				</View>

				{renderActionButtons()}
			</View>
			{showFooter ? (
				<>
					<DashedSeparator
						dashGap={4}
						dashLength={8}
						color={Colors[theme].shadesPurple06}
						thickness={2}
						containerClassName="mt-3"
					/>
					<Pressable
						className={`flex-row justify-between items-center px-3 pt-3 ${footerContainerClassName || ''}`}
						onPress={onPressChange}
					>
						<CustomText
							fontVarient="medium"
							className="text-sm text-secondary-blue"
						>
							{strings('common.ViewAllCoupons')}
						</CustomText>
						<SVGIcon
							name="arrow"
							style={{ transform: [{ rotate: isRTL() ? '180deg' : '0deg' }] }}
						/>
					</Pressable>
				</>
			) : null}
		</Section>
	);
}

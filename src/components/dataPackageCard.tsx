import { View } from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import Badge from './badge';
import CouponAppliedView from './couponApplied';
import CustomText from './customText';
import GenericImage from './image';
import InfoPill, { TextSegment } from './infoPill';
import PriceWithCurrencey from './priceWithCurrencey';
import { useAppTranslation } from '../hooks/useAppTranslation';

type DataPackageCardProps = {
	price: number;
	oringinalPrice?: number; //to show original price with strike through line
	phoneNumber?: string;
	mainContainerClass?: string;
	packageType: string;
	trailing?: React.ReactNode;
	infoPillClassName?: string;
	packageImage: string;
	infoContent: TextSegment[];
	bottomView?: React.ReactNode;
	badgeText?: string;
	couponCode?: string;
	isCouponApplied?: boolean;
	isPackageExpired?: boolean;
	childContainerClass?: string;
};

const DataPackageCard: React.FC<DataPackageCardProps> = (props) => {
	const {
		price,
		phoneNumber,
		mainContainerClass,
		packageType,
		trailing,
		infoPillClassName = 'bg-secondary-white',
		packageImage,
		infoContent,
		bottomView,
		oringinalPrice,
		badgeText,
		couponCode,
		isCouponApplied,
	} = props;
	const { fontPrimaryMedium, fontPrimaryRegular, animateColors } = constants;
	const { theme } = useUserPreferenceStore();
	const { t: strings } = useAppTranslation();

	return (
		<View
			className={`rounded-xl bg-shades-purple-06 p-4 w-full gap-3 ${mainContainerClass} ${animateColors}`}
		>
			<View className="flex-row justify-between items-center">
				<View className="gap-2">
					<View className="flex-row items-end gap-2">
						<GenericImage
							uri={packageImage}
							width="w-[70px]"
							height=""
							className={'aspect-[32/12]'}
							resizeMode="contain"
						/>
						<CustomText
							className={`text-shades-gray-01 ${fontPrimaryMedium} text-xs`}
						>
							{packageType}
						</CustomText>
					</View>
					<View className="flex-row">
						<InfoPill
							mainContainerClassName={`${infoPillClassName}`}
							texts={infoContent}
						/>

						{phoneNumber && (
							<InfoPill
								mainContainerClassName={`ms-2 ${infoPillClassName}`}
								texts={[
									{
										text: phoneNumber,
										weight: 'bold',
										textClassName: 'text-xs',
									},
								]}
							/>
						)}
					</View>
				</View>
				<View className="items-end justify-end">
					{oringinalPrice && (
						<PriceWithCurrencey
							height={10}
							width={9}
							price={oringinalPrice}
							customTextClassName={`text-xs text-shades-gray-02 ${fontPrimaryRegular}`}
							customDecimalTextClassName={'text-xxxs'}
							bgColor={Colors[theme].shadesGray02}
							showStrikeThroughLine={true}
						/>
					)}
					<View className="flex-row">
						<PriceWithCurrencey
							price={price}
							customTextClassName={`text-sm text-secondary-green ${fontPrimaryMedium}`}
							customDecimalTextClassName={'text-xxs'}
							bgColor={Colors[theme].secondaryGreen}
						/>
						{trailing && trailing}
					</View>
				</View>
			</View>
			{couponCode ? (
				isCouponApplied ? (
					<CouponAppliedView coupon={couponCode} />
				) : (
					<Badge
						textColorClassName="text-shades-gray-02"
						bgColorClassName="bg-secondary-white"
						containerClassName="border border-dashed border-shades-gray-06 self-start"
						label={
							<CustomText
								fontVarient="regular"
								className="text-xs text-shades-gray-02"
							>
								<CustomText
									className="text-xs text-shades-gray-02"
									fontVarient="medium"
								>
									{couponCode}{' '}
								</CustomText>
								{strings('common.willAutoApply')}
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
				)
			) : null}
			{bottomView && bottomView}
			{badgeText && (
				<View className="absolute right-4 -top-[13px]">
					<Badge
						label={badgeText}
						bgColorClassName=""
						textFontVariant="bold"
						containerClassName="bg-shades-blue-06 !rounded-full border border-white border-[2px]"
						textColorClassName="!text-secondary-blue !text-xxs"
					/>
				</View>
			)}
		</View>
	);
};

export default DataPackageCard;

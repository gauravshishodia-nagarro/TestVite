import { useMemo } from 'react';
import { Platform, Pressable, View } from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { userJourneyStore } from '../stores/userJourneyStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { formatPhone } from '../utils/formatter';
import CustomButton from './customButton';
import CustomText from './customText';
import DeliveryAddressCard from './deliveryAddressCards';
import GenericImage from './image';
import InfoPill from './infoPill';
import InlineMsg from './inlineMsg';
import PriceWithCurrencey from './priceWithCurrencey';
import Section from './section';
import Separator from './separator';
import SVGIcon from './svgIcon';

type BaseSuccessType = {
	title: string;
	subtitle: string;
	onPressSecondary?: (() => void) | undefined;
	onPressPrimary?: () => void;
	dateTime?: string;
	expdateTime?: string;
	mobileNumber?: string;
	primaryButtonLabel?: string;
	secondaryButtonLabel?: string;
	isEmbedded?: boolean;
	secondaryButtonClassName?: string;
	secondaryButtonLabelClassName?: string;
};

type OrderSuccessPropsType = BaseSuccessType & {
	type: 'device';
	orderNumber: string;
	address: string;
};
type SimActivationSuccessPropsType = BaseSuccessType & {
	type: 'esim_activated' | 'sim_card_activated';
	orderNumber: string;
	address: string;
	packageLogo: string;
	packageType: string;
};
type CancelOrderSuccessPropsType = BaseSuccessType & {
	type: 'cancelOrder';
	orderNumber: string;
};
type AutorenewPropsType = BaseSuccessType & {
	type: string;
	packageType: string;
	packageName: string;
	price: string;
	packageLogo: string;
	packageColor: string;
};
type MultiAutorenewPropsType = BaseSuccessType & {
	type: 'multiline-renewal';
	data: {
		packageType: string;
		packageName: string;
		mobileNumber: string;
		packageLogo: string;
	}[];
};
type OrderSimSuccessPropsType = BaseSuccessType & {
	type: 'order_sim';
	packageType: string;
	packageName: string;
	mobileNumber: string;
	packageLogo: string;
	address: string;
	customerName: string;
};

type PropsType =
	| AutorenewPropsType
	| OrderSuccessPropsType
	| CancelOrderSuccessPropsType
	| MultiAutorenewPropsType
	| OrderSimSuccessPropsType;

const { successFlowType } = constants;

const getImage = (flowType: string) => {
	if (flowType === successFlowType.autoRenewCancel) {
		return require('../../public/images/pause-auto-renew.webp');
	} else if (flowType === 'cancelOrder') {
		return require('../../public/images/cancel-order.webp');
	} else if (
		flowType === successFlowType.eSIMActivated ||
		flowType === successFlowType.simActivated
	) {
		return require('../../public/images/esim-activated-success.webp');
	}
	return require('../../public/images/checkmark.webp');
};

export default function OrderSuccessComponent(props: PropsType) {
	const { t } = useAppTranslation();
	const {
		type,
		subtitle,
		title,
		onPressPrimary,
		onPressSecondary,
		primaryButtonLabel,
		secondaryButtonLabel,
		secondaryButtonClassName = '',
		secondaryButtonLabelClassName = '',
	} = props;
	const { theme } = useUserPreferenceStore();
	const Slot = () => {
		switch (type) {
			case successFlowType.autoRenewCancel:
			case successFlowType.autoRenewSetup:
			case successFlowType.autoRenewResume:
			case successFlowType.renewPackage:
				return <AutoRenewSuccessSlot {...(props as AutorenewPropsType)} />;
			case successFlowType.multilineRenewal:
				return <MultiLineAutoRenewSuccessSlot {...(props as MultiAutorenewPropsType)} />;
			case 'device':
				return <OrderSuccessSlot {...(props as OrderSuccessPropsType)} />;
			case successFlowType.eSIMActivated:
			case successFlowType.simActivated:
				return <SimActivationSuccessSlot {...(props as SimActivationSuccessPropsType)} />;
			case successFlowType.welcomeToYaqoot:
				return <WelcomeToYaqootSlot {...props} />;
			case successFlowType.orderSIM:
				return <OrderSimSuccessSlot {...(props as OrderSimSuccessPropsType)} />;
			case 'cancelOrder':
				return <CancelOrderSuccessSlot {...(props as CancelOrderSuccessPropsType)} />;
			default:
				return null;
		}
	};
	const getImageSize = () => {
		switch (type) {
			case successFlowType.autoRenewCancel:
				return { width: '52', height: '52', w: 'w-[52px]', h: 'h-[52px]' };
			case successFlowType.autoRenewSetup:
			case successFlowType.autoRenewResume:
			case successFlowType.orderSIM:
			case successFlowType.eSIMActivated:
			case successFlowType.simActivated:
			case successFlowType.welcomeToYaqoot:
				return { width: '42', height: '42', w: 'w-[42px]', h: 'h-[42px]' };
			default:
				return { width: '64', height: '64', w: 'w-16', h: 'h-16' };
		}
	};
	const subContainerClassName = () => {
		switch (type) {
			case successFlowType.autoRenewCancel:
				return '!ms-1 !gap-3';
			case successFlowType.autoRenewSetup:
			case successFlowType.autoRenewResume:
			case successFlowType.orderSIM:
			case successFlowType.welcomeToYaqoot:
				return '!ms-1';
			case successFlowType.eSIMActivated:
			case successFlowType.simActivated:
				return '!ms-2';
			default:
				return '';
		}
	};
	const { width, height, w, h } = getImageSize();
	const showSeparator = () => {
		return type !== successFlowType.autoRenewCancel;
	};
	const needHelpClassName = () => {
		if (
			type === successFlowType.autoRenewResume ||
			type === successFlowType.autoRenewSetup
		) {
			return '!text-secondary-gray';
		} else {
			return '';
		}
	};

	return (
		<View className="p-5 w-full flex-1 justify-between">
			<Section isCustomLabel customLabel>
				<View
					className={`flex-row gap-5 justify-center items-center mb-4 ${subContainerClassName()}`}
				>
					<GenericImage
						width={width}
						height={height}
						uri={getImage(type)}
						className={`${w} ${h}`}
						resizeMode="contain"
					/>
					<View className="gap-1 flex-1">
						<CustomText
							fontVarient="bold"
							className="text-base text-secondary-gray self-start"
						>
							{title}
						</CustomText>
						<CustomText
							fontVarient="regular"
							className={`text-sm text-shades-gray-02 self-start ${Platform.OS === 'web' ? 'text-start' : 'text-left'}`}
						>
							{subtitle}
						</CustomText>
					</View>
				</View>
				{showSeparator() && (
					<Separator color={Colors[theme].shadesBorder02} thickness={1} />
				)}
				<Slot />
				{type !== successFlowType.autoRenewCancel &&
					type !== successFlowType.eSIMActivated &&
					type !== successFlowType.simActivated &&
					type !== successFlowType.welcomeToYaqoot && (
						<>
							<Separator color={Colors[theme].shadesBorder02} thickness={1} />
							<View className="mt-4">
								<CustomText
									fontVarient="regular"
									className={`text-sm text-shades-gray-02 pb-2 self-start ${needHelpClassName()}`}
								>
									{t('label.needHelp')}
								</CustomText>
								<View className="flex-row gap-2">
									<Pressable className="rounded-lg border border-shades-gray-06 px-2">
										<CustomText
											className="text-sm text-secondary-blue py-1"
											fontVarient="medium"
										>
											{t('label.whatsAppUs')}
										</CustomText>
									</Pressable>
									<Pressable className="rounded-lg border border-shades-gray-06 px-2">
										<CustomText
											className="text-sm text-secondary-blue py-1"
											fontVarient="medium"
										>
											{t('label.callUs')}
										</CustomText>
									</Pressable>
								</View>
							</View>
						</>
					)}
			</Section>
			<View className={`pb-safe gap-2 ${props?.isEmbedded ? 'mt-6' : ''}`}>
				{onPressPrimary && (
					<CustomButton
						labelClassName="self-center"
						onPress={onPressPrimary}
						label={primaryButtonLabel}
						type="filled"
					/>
				)}
				{onPressSecondary && (
					<CustomButton
						labelClassName={`self-center ${secondaryButtonLabelClassName}`}
						label={secondaryButtonLabel ?? t('button.home')}
						onPress={onPressSecondary}
						type="outlined"
						containerClassName={`${secondaryButtonClassName}`}
					/>
				)}
			</View>
		</View>
	);
}

const OrderSuccessSlot = (props: OrderSuccessPropsType) => {
	const { t } = useAppTranslation();
	const { address, orderNumber, dateTime, mobileNumber } = props;
	return (
		<View>
			<View className="my-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-02 pb-1 self-start"
				>
					{t('label.yourOrderNumber')}
				</CustomText>
				<CustomText
					fontVarient="medium"
					className="text-sm text-secondary-gray"
				>
					{orderNumber}
				</CustomText>
			</View>

			<View className="mb-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-02 pb-1 self-start"
				>
					{t('label.deliverylocDateAndTime')}
				</CustomText>
				<CustomText
					fontVarient="medium"
					className="text-sm text-secondary-gray pb-0 self-start"
				>
					{address}
				</CustomText>
				<CustomText
					fontVarient="regular"
					className="text-sm text-secondary-gray self-start"
				>
					{dateTime ?? ''}
				</CustomText>
				{mobileNumber ? (
					<CustomText
						fontVarient="regular"
						className="text-sm text-secondary-gray self-start"
					>
						{t('common.mobileNumber').replace('{placeholder}', ':')} {mobileNumber}
					</CustomText>
				) : null}
			</View>
		</View>
	);
};

const WelcomeToYaqootSlot = (_props: BaseSuccessType) => {
	return (
		<View className="py-[6px] px-3 bg-shades-purple-06 rounded-full mt-4 items-center flex-row gap-3">
			<GenericImage
				resizeMode="contain"
				height="h-20"
				width="w-20"
				className="h-5 w-5"
				uri={require('../../public/images/circular-exclamation.webp')}
			/>
			<CustomText
				fontVarient="regular"
				className="text-shades-gray-01 text-xs flex-1"
			>
				You have <CustomText fontVarient="bold">3 days</CustomText> to change
				apps and all App expires when packages expires
			</CustomText>
		</View>
	);
};

const SimActivationSuccessSlot = (props: SimActivationSuccessPropsType) => {
	const { t } = useAppTranslation();
	const { packageLogo, packageType, mobileNumber } = props;
	return (
		<View>
			<View className="my-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-03 mb-[10px] self-start"
				>
					{t('label.packageDetails')}
				</CustomText>
				<View className={'flex-row gap-3'}>
					<View className={'flex-row justify-start items-center gap-3'}>
						<GenericImage
							height="20"
							width="59"
							uri={packageLogo ?? require('../../public/images/demo/minix-inactive.png')}
							className="h-[20px] w-[59px]"
							resizeMode="contain"
						/>
					</View>
					<View className="flex-row gap-2">
						<InfoPill
							mainContainerClassName="bg-shades-purple-06"
							texts={[
								{
									text: packageType,
									textClassName: 'pe-1 text-xs text-shades-gray-01',
									weight: 'bold',
								},
								{
									text: 'Card',
									textClassName: 'text-xs text-shades-gray-01',
								},
							]}
						/>
						{!!mobileNumber && (
							<InfoPill
								mainContainerClassName="bg-shades-purple-06"
								texts={[
									{
										text: mobileNumber as string,
										textClassName: 'text-xs text-shades-gray-01',
										weight: 'bold',
									},
								]}
							/>
						)}
					</View>
				</View>
			</View>
		</View>
	);
};

const OrderSimSuccessSlot = (props: OrderSimSuccessPropsType) => {
	const { t } = useAppTranslation();
	const {
		address,
		dateTime,
		customerName,
		mobileNumber,
		packageLogo,
		packageType,
	} = props;
	const { theme } = useUserPreferenceStore();

	const renderAddressFooter = ({
		date,
		phoneNumber,
	}: { date?: string; phoneNumber?: string }) => {
		return (
			<View className="gap-1">
				{date && (
					<View className="flex-row gap-1 items-center">
						<SVGIcon
							name={'package'}
							width={16}
							height={16}
							viewBox="0 -3 14 16"
							style={{ marginBottom: 4 }}
							pathFill={Colors[theme].shadesGray02}
						/>
						<CustomText
							fontVarient="regular"
							className="text-sm text-shades-gray-01"
						>
							{date ?? ''}
						</CustomText>
					</View>
				)}
				{phoneNumber && (
					<View className="flex-row gap-1 items-center">
						<SVGIcon
							name={'phone2'}
							width={16}
							height={16}
							viewBox="0 -2 14 16"
							style={{ marginBottom: 4 }}
							pathFill={Colors[theme].shadesGray02}
						/>
						<CustomText
							fontVarient="regular"
							className="text-sm text-shades-gray-01"
						>
							{phoneNumber ?? ''}
						</CustomText>
					</View>
				)}
			</View>
		);
	};
	return (
		<View>
			<View className="my-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-03 mb-[10px] self-start"
				>
					{t('label.packageDetails')}
				</CustomText>
				<View className={'flex-row gap-3'}>
					<View className={'flex-row justify-start items-center gap-3'}>
						<GenericImage
							height="20"
							width="59"
							uri={packageLogo ?? require('../../public/images/demo/minix-inactive.png')}
							className="h-[20px] w-[59px]"
							resizeMode="contain"
						/>
					</View>
					<View className="flex-row gap-2">
						<InfoPill
							mainContainerClassName="bg-shades-purple-06"
							texts={[
								{
									text: packageType,
									textClassName: 'pe-1 text-xs text-shades-gray-01',
									weight: 'bold',
								},
								{
									text: 'Card',
									textClassName: 'text-xs text-shades-gray-01',
								},
							]}
						/>
						{!!mobileNumber && (
							<InfoPill
								mainContainerClassName="bg-shades-purple-06"
								texts={[
									{
										text: mobileNumber as string,
										textClassName: 'text-xs text-shades-gray-01',
										weight: 'bold',
									},
								]}
							/>
						)}
					</View>
				</View>
			</View>
			<View className="mb-4 mt-2">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-03 mb-2 self-start"
				>
					{t('label.deliveryInformation')}
				</CustomText>
				<DeliveryAddressCard
					title={customerName}
					description={address ?? ''}
					editable={false}
					containerClassName="!p-0 mb-"
					titleTextClassName={`!text-sm ${constants.fontPrimaryMedium} !mb-[2px]`}
					descriptionTextClassName="!text-shades-gray-01 !mb-[6px]"
					showLeadingIcon={false}
					renderFooter={renderAddressFooter({
						date: dateTime ?? '',
						phoneNumber: mobileNumber,
					})}
				/>
			</View>
		</View>
	);
};

const CancelOrderSuccessSlot = (props: CancelOrderSuccessPropsType) => {
	const { t } = useAppTranslation();
	const { orderNumber } = props;
	return (
		<View>
			<View className="my-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-02 pb-1 self-start"
				>
					{t('label.yourOrderNumber')}
				</CustomText>
				<CustomText
					fontVarient="medium"
					className="text-sm text-secondary-gray"
				>
					{orderNumber}
				</CustomText>
			</View>
		</View>
	);
};

const AutoRenewSuccessSlot = (props: AutorenewPropsType) => {
	const { t } = useAppTranslation();
	const {
		packageType,
		mobileNumber,
		expdateTime,
		price,
		type,
		packageLogo,
		packageColor,
	} = props;
	const { fontPrimaryMedium } = constants;
	const { theme } = useUserPreferenceStore();
	const getContainerClass = () => {
		if (type === successFlowType.autoRenewCancel) {
			return 'border border-shades-purple-06 rounded-[12px]';
		}
		return '';
	};
	return (
		<View className={getContainerClass()}>
			<View className="my-4">
				{type !== successFlowType.autoRenewCancel && (
					<CustomText
						fontVarient="regular"
						className="text-sm text-shades-gray-02 pb-1 self-start"
					>
						{t('label.packageDetails')}
					</CustomText>
				)}
				<View
					className={`flex-row justify-between items-center ${type === successFlowType.autoRenewCancel ? 'px-4' : ''}`}
				>
					<View
						className={`${type === successFlowType.autoRenewCancel ? 'flex-column' : 'flex-row gap-3'} `}
					>
						<View className={'flex-row justify-start items-center gap-3'}>
							<View
								style={packageColor ? { backgroundColor: packageColor } : {}}
								className={`${packageColor ? 'p-[1px]' : ''} rounded-[4px]`}
							>
								<GenericImage
									height="20"
									width="59"
									uri={packageLogo ?? ''}
									className="h-[20px] w-[59px]"
									resizeMode="contain"
								/>
							</View>
							{type === successFlowType.autoRenewCancel && (
								<CustomText
									fontVarient="medium"
									className="text-xs text-secondary-gray mt-2"
								>
									{packageType}
								</CustomText>
							)}
						</View>
						<View className="flex-row gap-2">
							<InfoPill
								mainContainerClassName="bg-shades-purple-06"
								texts={[
									{
										text: packageType,
										textClassName: 'pe-1 text-xs text-shades-gray-01',
										weight: 'bold',
									},
									{
										text: 'Card',
										textClassName: 'text-xs text-shades-gray-01',
									},
								]}
							/>
							<InfoPill
								mainContainerClassName="bg-shades-purple-06"
								texts={[
									{
										text: mobileNumber as string,
										textClassName: 'text-xs text-shades-gray-01',
										weight: 'bold',
									},
								]}
							/>
						</View>
					</View>
					{price && (
						<PriceWithCurrencey
							width={12}
							height={14}
							price={price}
							customTextClassName={`text-sm text-secondary-green ${fontPrimaryMedium}`}
							bgColor={Colors[theme].secondaryGreen}
						/>
					)}
				</View>
			</View>
			{expdateTime && (
				<View
					className={`${type === successFlowType.autoRenewCancel ? 'p-3 bg-shades-yellow-06 mx-[1px] mb-[1px] rounded-[10px]' : 'mt-2 mb-4'}  `}
				>
					<CustomText
						fontVarient="regular"
						className="text-xs text-shades-gray-02 self-start"
					>
						{type === successFlowType.autoRenewCancel
							? t('label.yourPackageWillExpireOn')
							: t('label.nextBillingDate')}
					</CustomText>
					<View className="flex-row gap-1 items-center mt-1">
						{type === successFlowType.autoRenewCancel && (
							<SVGIcon name={'time'} height={16} width={16} />
						)}
						<CustomText
							fontVarient="medium"
							className="text-sm text-secondary-gray self-start"
						>
							{expdateTime}
						</CustomText>
					</View>
				</View>
			)}
		</View>
	);
};

const MultiLineAutoRenewSuccessSlot = (props: MultiAutorenewPropsType) => {
	const { t } = useAppTranslation();
	const { data } = props;

	return (
		<View>
			<View className="my-4">
				<CustomText
					fontVarient="regular"
					className="text-sm text-shades-gray-02 pb-1 self-start"
				>
					{t('label.packageRenewalDetails')}
				</CustomText>

				<View className="justify-between gap-4 mt-2">
					{data.map(
						({ packageLogo, mobileNumber, packageName, packageType }) => {
							return (
								<View className="flex-row gap-3" key={packageName}>
									<View className={'flex-row justify-start items-center gap-3'}>
										<GenericImage
											height="20"
											width="59"
											uri={packageLogo ?? require('../../public/images/demo/minix-inactive.png')}
											className="h-[20px] w-[59px]"
											resizeMode="contain"
										/>
									</View>
									<View className="flex-row gap-2">
										<InfoPill
											mainContainerClassName="bg-shades-purple-06"
											texts={[
												{
													text: packageType,
													textClassName: 'pe-1 text-xs text-shades-gray-01',
													weight: 'bold',
												},
												{
													text: 'Card',
													textClassName: 'text-xs text-shades-gray-01',
												},
											]}
										/>
										<InfoPill
											mainContainerClassName="bg-shades-purple-06"
											texts={[
												{
													text: mobileNumber as string,
													textClassName: 'text-xs text-shades-gray-01',
													weight: 'bold',
												},
											]}
										/>
									</View>
								</View>
							);
						},
					)}
				</View>
			</View>
		</View>
	);
};

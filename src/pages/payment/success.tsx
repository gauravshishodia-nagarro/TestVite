import OrderSuccessComponent from '../../components/orderSuccess';
import constants from '../../configs/constants';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { NavigationProp, RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import CustomButton from '../../components/customButton';
import CustomFooter from '../../components/customFooter';
import CustomText from '../../components/customText';
import GenericImage from '../../components/image';
import { refetchMultiLine } from '../../utils/util';

type SuccessRouteParams = {
	Success: {
		type: string;
		isMultiline?: string;
		packageName?: string;
		packageType?: string;
		mobileNumber?: string;
		packageLogo?: string;
		orderNumber?: string;
		address?: string;
		dateTime?: string;
		expdateTime?: string;
		price?: string;
		packageColor?: string;
		packageImage?: string;
		isEmbedded?: string;
	};
};

const { successFlowType, fontPrimaryBold, fontPrimaryRegular, fontPrimaryMedium } = constants;

const SuccessScreen: React.FC = () => {
	const { t } = useAppTranslation();
	const navigation = useNavigation<NavigationProp<any>>();
	const queryClient = useQueryClient();
	const route = useRoute<RouteProp<SuccessRouteParams, 'Success'>>();
	const params = route.params || {};
	const { type, isMultiline, ...rest } = params;
	const isMultilineValue = isMultiline === 'true';

	const { resetJourneyState, multilineRenewPackages } = userJourneyStore();
	const { firstPackageSku } = useUserPreferenceStore();

	const forPayment =
		type === successFlowType.renewPackage ||
		type === successFlowType.multilineRenewal;
	const hideFooter = type === successFlowType.orderPaymet;

	useEffect(() => {
		if (type === successFlowType.orderPaymet) {
			const timer = setTimeout(() => {
				refetchMultiLine(queryClient);
				navigateToHome();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [type]);

	const navigateToHome = () => {
		refetchMultiLine(queryClient);
		navigation.reset({
			index: 0,
			routes: [{ name: 'tabs' }],
		});
	};

	const getTitle = () => {
		switch (type) {
			case successFlowType.renewPackage:
			case successFlowType.multilineRenewal:
				return t('label.paymentSuccessfull');
			case successFlowType.orderSIM:
				return t('label.orderConfirmed');
			case successFlowType.eSIMActivated:
				return t('label.eSIMActivated');
			case successFlowType.simActivated:
				return t('label.SIMCardActivated');
			case successFlowType.orderPaymet:
				return t('label.paymentSuccessEsim');
			case successFlowType.welcomeToYaqoot:
				return t('label.welcomeToYaqootWorld');
			case successFlowType.orderDeviceSuccess:
				return t('label.orderConfirmed');
			case successFlowType.autoRenewResume:
				return t('common.autoRenewResumeSuccessTitle');
			case successFlowType.autoRenewSetup:
				return t('common.autoRenewSuccessTitle');
			case successFlowType.autoRenewCancel:
				return t('common.autoRenewPauseSuccessTitle');
			case successFlowType.addAppSuccess:
				return t('common.appAddSuccess');
			case successFlowType.cancelOrderSuccess:
				return t('label.orderCancelledSuccess');
			case successFlowType.addressUpdated:
				return t('common.addUpdateSuccess');
			default:
				return '';
		}
	};

	const getSubheading = () => {
		switch (type) {
			case successFlowType.renewPackage:
				return t('label.packageRenewedSuccessfully');
			case successFlowType.multilineRenewal:
				return t('label.multiPackageRenewedSubHeading');
			case successFlowType.orderSIM:
				return t('label.activateSIMHomePage');
			case successFlowType.eSIMActivated:
				return t('label.eSIMActivatedSuccess');
			case successFlowType.simActivated:
				return t('label.SIMCardActivatedSuccessfuuly');
			case successFlowType.welcomeToYaqoot:
				return t('label.yourUnlimitedAppsSelected');
			case successFlowType.orderDeviceSuccess:
				return t('common.confirmOrderMsg');
			case successFlowType.autoRenewCancel:
				return t('common.autoRenewPauseSuccessSubTitle');
			case successFlowType.autoRenewSetup:
				return t('common.autoRenewSuccessSubTitle');
			case successFlowType.autoRenewResume:
				return t('common.autoRenewResumeSuccessSubTitle');
			case successFlowType.addAppSuccess:
				return t('common.enjoyYourExpWithYaqoot');
			case successFlowType.cancelOrderSuccess:
				return t('label.orderCancelledSuccessSubTitle');
			case successFlowType.addressUpdated:
				return t('common.addUpdateSuccessSubtitle');
			default:
				return '';
		}
	};

	const getPrimaryButtonLabel = () => {
		switch (type) {
			case successFlowType.renewPackage:
			case successFlowType.eSIMActivated:
			case successFlowType.simActivated:
			case successFlowType.multilineRenewal:
			case successFlowType.unlimitedAppsSelection:
			case successFlowType.addAppSuccess:
			case successFlowType.welcomeToYaqoot:
				return t('button.home');
			case successFlowType.orderSIM:
				return t('button.trackOrder');
			case successFlowType.addressUpdated:
				return t('button.backtoOrder');
			default:
				return t('button.home');
		}
	};

	const handlePrimaryButtonPress = () => {
		resetJourneyState();
		navigateToHome();
	};

	const handleSecondaryButtonPress = () => {
		resetJourneyState();
		navigateToHome();
	};

	const getImage = () => {
		switch (type) {
			case successFlowType.eSIMActivated:
				return require('../../../public/images/esim-activated.webp');
			case successFlowType.simActivated:
				return require('../../../public/images/sim-activated-success.webp');
			default:
				return require('../../../public/images/success.webp');
		}
	};

	// renewPackage (single line)
	if (
		type === successFlowType.autoRenewSetup ||
		type === successFlowType.autoRenewCancel ||
		type === successFlowType.autoRenewResume ||
		type === successFlowType.renewPackage
	) {
		return (
			<OrderSuccessComponent
				type={type}
				title={getTitle()}
				subtitle={getSubheading()}
				dateTime={rest?.dateTime ?? ''}
				primaryButtonLabel={t('action.done')}
				packageName={rest?.packageName ?? ''}
				packageType={rest?.packageType ?? ''}
				isEmbedded={rest?.isEmbedded === 'true'}
				mobileNumber={rest?.mobileNumber ?? ''}
				onPressPrimary={handlePrimaryButtonPress}
				expdateTime={rest?.expdateTime}
				price={rest?.price ?? ''}
				packageLogo={rest?.packageImage}
				packageColor={rest?.packageColor ?? ''}
			/>
		);
	}

	// multiline renewal
	if (type === successFlowType.multilineRenewal) {
		const { multilineRenewPackages: renewPackages } = userJourneyStore.getState();
		const data = (renewPackages ?? []).map((item) => ({
			packageType:
				item.simType === 'ESIM'
					? t('common.eSim')
					: t('common.sim'),
			packageName: item.incentivePackageDetails?.name ?? '',
			packageLogo: item.incentivePackageDetails?.package_logo_image ?? '',
			mobileNumber: item.msisdn ?? '',
		}));
		return (
			<OrderSuccessComponent
				type={type}
				title={getTitle()}
				subtitle={getSubheading()}
				data={data}
				primaryButtonLabel={getPrimaryButtonLabel()}
				onPressPrimary={handlePrimaryButtonPress}
			/>
		);
	}

	// addAppSuccess / welcomeToYaqoot
	if (
		type === successFlowType.addAppSuccess ||
		type === successFlowType.welcomeToYaqoot
	) {
		return (
			<OrderSuccessComponent
				type={type === successFlowType.addAppSuccess ? successFlowType.welcomeToYaqoot : successFlowType.welcomeToYaqoot}
				title={getTitle()}
				subtitle={getSubheading()}
				onPressPrimary={handlePrimaryButtonPress}
				primaryButtonLabel={getPrimaryButtonLabel()}
			/>
		);
	}

	// Fallback view for orderPaymet and any unhandled types
	return (
		<View className="flex-1 mb-5">
			<View className="flex-1 justify-center items-center p-5 mb-[120px]">
				<GenericImage
					uri={getImage()}
					width="w-[157px]"
					height="h-[117px]"
					resizeMode="contain"
				/>
				<CustomText
					className={`${fontPrimaryBold} text-xl text-secondary-gray text-center pt-6`}
				>
					{getTitle()}
				</CustomText>
				<CustomText
					className={`${fontPrimaryRegular} text-base text-shades-gray-02 text-center pt-2`}
				>
					{getSubheading()}
					{forPayment && !isMultilineValue && (
						<CustomText className={`${fontPrimaryBold}`}>{'XXX'}</CustomText>
					)}
				</CustomText>
			</View>
			{!hideFooter && (
				<CustomFooter className="!bg-transparent pb-5" showShadow={false}>
					<View className="mx-1 gap-6">
						<CustomButton
							label={getPrimaryButtonLabel()}
							onPress={handlePrimaryButtonPress}
						/>
						{forPayment && (
							<CustomText
								onPress={handleSecondaryButtonPress}
								className={`${fontPrimaryMedium} text-base text-secondary-gray text-center active:opacity-55`}
							>
								{t('button.home')}
							</CustomText>
						)}
					</View>
				</CustomFooter>
			)}
		</View>
	);
};

export default SuccessScreen;

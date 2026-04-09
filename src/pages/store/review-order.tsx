import { useGetOrderDetailsQuery } from '../../apis/services/delivery';
import { usePayment } from '../../apis/services/payment';
import { useGetSimOrderCartQuery } from '../../apis/services/telcoProvision';
import { PackageType } from '../../apis/types/store';
import AppsIcon from '../../components/appsIcon';
import CardFeatureItem from '../../components/cardFeatureItem';
import CustomButton from '../../components/customButton';
import CustomFooter from '../../components/customFooter';
import CustomText from '../../components/customText';
import DeliveryAddressCard from '../../components/deliveryAddressCards';
import Divider from '../../components/divider';
import GenericImage from '../../components/image';
import InfoPill from '../../components/infoPill';
import Loader from '../../components/loader';
import Section from '../../components/section';
import SVGIcon from '../../components/svgIcon';
import TransactionDetailItem from '../../components/transactionDetailItem';
import constants from '../../configs/constants';
import { Colors } from '../../configs/themes';
import { getScreenTitle } from '../../helpers/journeyHelper';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';
import { useStepProgressStore } from '../../stores/useStepProgressStore';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import { SIM_TYPE } from '../../types';
import { formatDeliverySlot  } from '../../utils/formatter';
import {
	closeSheetModal,
	replaceTelcoTokenWithChild,
	switchToNewLine,
} from '../../utils/util';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { unlimetedApps } from './packages';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { StackActions, useNavigation, useFocusEffect } from '@react-navigation/native';

type FeatureType = {
	icon_path: string;
	segments: { text: string; format: { bold: boolean } }[];
	showApps?: boolean;
};

type FeatureListProps = {
	features: FeatureType[];
	unlimetedApps: string[];
	id: string;
	handleChangePackage: () => void;
};

const FeatureList: React.FC<FeatureListProps> = React.memo(
	({ features, unlimetedApps, id, handleChangePackage }) => {
		const { fontPrimaryBold } = constants;
		const {t} = useAppTranslation();
		const isTelco = useUserPreferenceStore.getState().userType === 'TELCO';

		if (!features?.length && isTelco) return null;

		return (
			<View className="rounded-2xl">
				{features?.length > 0 && (
					<>
						<CustomText
							className={`${fontPrimaryBold} text-base text-secondary-gray ${
								Platform.OS === 'web' ? 'text-start' : 'text-left'
							}`}
						>
							{t('label.packageFeatures')}
						</CustomText>

						{features?.map((item, index) => {
							const filteredSegments = item?.segments?.map(
								({ text, format }) => ({
									text,
									isBold: format.bold,
								}),
							);

							return (
								<View key={index}>
									<CardFeatureItem
										keyName={id}
										imageUrl={item.icon_path}
										textContent={filteredSegments}
										containerClassName="mt-4 py-1"
										textClassName="!text-base"
									/>
									{item.showApps && (
										<View className="flex-row flex-wrap gap-3 mt-4 items-center justify-center">
											{unlimetedApps?.map((appUri, index) => (
												<AppsIcon
													key={index}
													imageUri={appUri}
													imageWidth="w-[28px]"
													imageHeight=""
													imageClassName="!rounded-[6px] my-1 aspect-[1/1]"
												/>
											))}
										</View>
									)}
								</View>
							);
						})}
					</>
				)}

				{!isTelco && (
					<CustomButton
						containerClassName="mt-4 !py-2"
						label={'Change'}
						onPress={handleChangePackage}
						type="outlined"
					/>
				)}
			</View>
		);
	},
);

const SectionView = ({
	selectedPackage,
	imageWidth = 'w-[58px]',
	imageHeight = 'h-[20px]',
	requestedMsisdnInOrderDetail,
}: {
	selectedPackage: PackageType;
	imageWidth?: string;
	imageHeight?: string;
	requestedMsisdnInOrderDetail?: string;
}) => {
	const {t} = useAppTranslation();

	const { simType, selectedNumber, phoneNumber, journeyName } =
		userJourneyStore();
	// Picking phone number in case of switch journey
	const number =
		journeyName === 'SWITCH_NUMBER'
			? phoneNumber
			: (selectedNumber?.msisdn ?? requestedMsisdnInOrderDetail ?? '');
	return (
		<View className="flex-row gap-3 items-center">
			{selectedPackage?.package_logo_image && (
				<GenericImage
					uri={selectedPackage.package_logo_image}
					width={imageWidth}
					height={imageHeight}
					resizeMode="contain"
					className="float-start"
				/>
			)}
			<InfoPill
				texts={[
					{
						text:
							simType === SIM_TYPE.PHYSICAL
								? t('common.sim')
								: t('common.eSim'),
						weight: 'bold',
					},
					{ text: t('label.card') },
				]}
				mainContainerClassName="!bg-shades-purple-06"
			/>
			<InfoPill
				texts={[{ text: number || '', weight: 'bold' }]}
				mainContainerClassName="!bg-shades-purple-06"
			/>
		</View>
	);
};

const ConfirmOrder: React.FC = () => {
	const queryClient = useQueryClient();
	const { fontPrimaryBold, fontPrimaryRegular, successFlowType, paymentFor } =
		constants;
	const { theme } = useUserPreferenceStore();
	const { setActiveSheet } = useBottomSheetStore();

	const {
		simType,
		selectedPackage,
		setJourneyState,
		email,
		journeyName,
		name,
		phoneNumber,
	} = userJourneyStore();

	const { isLoading: isOrderDetailsLoading, data: orderDetailData } =
		useGetOrderDetailsQuery();

	const { isLoading: isSimOrderCartLoading, data: simOrderCartData } =
		useGetSimOrderCartQuery();

	const { isPending: isPaymentLoading, mutateAsync: paymentMutation } =
		usePayment();

	const _selectedPackage =
		simType === SIM_TYPE.ESIM
			? (selectedPackage?.esimPackage ?? selectedPackage)
			: selectedPackage;

	const priceWithoutTax =
		(_selectedPackage?.price_tax ?? 0) -
		(_selectedPackage?.product_tax_amount ?? 0);
	const totalPrice = _selectedPackage?.price_tax ?? 0;
	const vatAmount = _selectedPackage?.product_tax_amount ?? 0;

	const vat = (_selectedPackage?.product_tax_percentage ?? 0)?.toFixed(2);

	const navigation = useNavigation();
	const { gotoNextStep } = useStepProgressStore();
	const { t } = useAppTranslation();

	useFocusEffect(
		useCallback(() => {
			// setProgress(
			// 	simType === SIM_TYPE.ESIM ? (totalSteps === 5 ? 3 : 2) : totalSteps,
			// );
			gotoNextStep();
		}, [gotoNextStep]),
	);

	useEffect(() => {
		if (!orderDetailData?.requestedMsisdn) return;

		userJourneyStore.getState().setJourneyState({
			requestedMsisdnInOrderDetails: orderDetailData?.requestedMsisdn,
		});
	}, [orderDetailData?.requestedMsisdn]);

	const handleConfirmOrder = () => {
		paymentMutation({
			orderId: simOrderCartData?.orderId || '',
			email: email,
			paymentOptionFlag: 'FREE',
		}).then(() => {
			if (orderDetailData?.payBeforeActivation) {
				switchToNewLine(queryClient);
				//TODO: navigate to payment screen with order id and amount

				navigation.dispatch(
					StackActions.replace('reviewPayment', {
						id: _selectedPackage?.sku || '',
						type: paymentFor.orderSIM,
						title: getScreenTitle({ journeyName, simType, t }),
					})
				);
			} else {
				replaceTelcoTokenWithChild();
				if (simType === SIM_TYPE.PHYSICAL) {
					navigation.dispatch(
					StackActions.replace('success', {
						type: successFlowType.orderSIM,
						address: orderDetailData?.address || '',
						packageType: _selectedPackage?.package_behavior || '',
						packageName: _selectedPackage?.name || '',
						packageLogo: _selectedPackage?.package_logo_image || '',
						dateTime: formatDeliverySlot({
							deliveryDate: orderDetailData?.deliveryDate ?? '',
							deliveryMonth: orderDetailData?.deliveryMonth ?? '',
							deliveryYear: orderDetailData?.deliveryYear ?? '',
							deliverySlot: orderDetailData?.deliverySlot ?? '',
						}),
						mobileNumber: phoneNumber || '',
						customerName: name || '',
					})
				);
				} else {
					navigation.dispatch(
					StackActions.replace('Success', {
						type: successFlowType.orderPaymet
					})
				);
				}
			}
		});
		// .catch((error) => {
		// 	alert(error?.message);
		// });
	};
	const handleChangePackage = () => {
		setActiveSheet('changePackageSheet', {
			snapPoints: ['90%', '100%'],
			title: t('label.changePackage'),
			props: {
				onChangePackage: (_package: PackageType) => {
					closeSheetModal();
					setJourneyState({ selectedPackage: _package });
				},
				_packageType: selectedPackage?.package_behavior,
			},
		});
	};

	const renderAddressFooter = useMemo(() => {
		return (
			<View className="gap-2 mt-2">
				<View className="flex-row gap-[5px] items-center">
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
						{formatDeliverySlot({
							deliveryDate: orderDetailData?.deliveryDate ?? '',
							deliveryMonth: orderDetailData?.deliveryMonth ?? '',
							deliveryYear: orderDetailData?.deliveryYear ?? '',
							deliverySlot: orderDetailData?.deliverySlot ?? '',
						})}
					</CustomText>
				</View>
				<View className="flex-row gap-[5px] items-center">
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
			</View>
		);
	}, [theme, phoneNumber, orderDetailData]);

	return (
		<>
			<View className="flex-1">
				<View className="mx-5 flex-1 my-6">
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="pb-[150px]"
					>
						<CustomText
							className={`text-lg text-secondary-gray ${fontPrimaryBold}`}
						>
							{t('label.confirmYourOrder')}
						</CustomText>

						{_selectedPackage && (
							<Section
								label=""
								isCustomLabel={true}
								customLabel={
									<SectionView
										selectedPackage={_selectedPackage}
										requestedMsisdnInOrderDetail={
											orderDetailData?.requestedMsisdn
										}
									/>
								}
								isCollapsible
								containerClassName="mt-6"
							>
								<>
									<Divider containerClassName="my-4" />
									<FeatureList
										features={_selectedPackage?.features}
										id={_selectedPackage.id.toString()}
										unlimetedApps={unlimetedApps}
										handleChangePackage={handleChangePackage}
									/>
								</>
							</Section>
						)}

						{simType === SIM_TYPE.PHYSICAL && (
							<DeliveryAddressCard
								title={name ?? ''}
								description={orderDetailData?.address ?? ''}
								editable={false}
								containerClassName="mt-4"
								titleTextClassName={`!text-sm ${constants.fontPrimaryMedium} !mb-[2px]`}
								showLeadingIcon={false}
								titleLeadingView={
									<SVGIcon
										name={'location'}
										width={24}
										height={24}
										viewBox="0 0 24 24"
										style={{ marginBottom: 4 }}
									/>
								}
								renderFooter={renderAddressFooter}
							/>
						)}

						<View className="bg-secondary-white rounded-xl p-4 mt-4">
							<View className="flex-row gap-2 items-start">
								<SVGIcon
									name={'transaction'}
									width={24}
									height={24}
									viewBox="0 0 18 20"
								/>
								<CustomText
									className={`text-base text-secondary-gray ${fontPrimaryBold}`}
								>
									{t('label.transactionDetails')}
								</CustomText>
							</View>
							<TransactionDetailItem
								leadingLabel={`Package Price [${_selectedPackage?.sku}]`}
								price={priceWithoutTax}
								containerClassName="mt-4"
								leadingLabelFont={fontPrimaryRegular}
								leadingLabelClassName="!text-shades-gray-01"
							/>
							<TransactionDetailItem
								leadingLabel={t('label.vatPercentage').replace(
									'VATPERCENTAGE',
									vat,
								)}
								price={vatAmount}
								containerClassName="mt-2"
								leadingLabelFont={fontPrimaryRegular}
								leadingLabelClassName="!text-shades-gray-01"
							/>
							{/* <TransactionDetailItem
							leadingLabel={t('label.deliveryCharges')}
							price={priceWithoutTax}
							discount={priceWithoutTax}
							containerClassName="mt-2"
							trailingLabelClassName="!text-secondary-green"
							leadingLabelFont={fontPrimaryRegular}
							leadingLabelClassName="!text-shades-gray-01"
						/> */}
							<View className="bg-shades-gray-06 h-[1px] w-full my-4" />
							<TransactionDetailItem
								leadingLabel={t('label.totalPrice')}
								price={totalPrice}
								leadingLabelClassName="!text-base !text-secondary-gray"
								trailinglabelFont={fontPrimaryBold}
								trailingLabelClassName="!text-base !text-secondary-green"
								currencyIconWidth={14}
								currencyIconHeight={16}
								currencyColor={Colors[theme].secondaryGreen}
							/>
						</View>
					</ScrollView>
				</View>
				<CustomFooter>
					<CustomButton
						label={
							simType === SIM_TYPE.ESIM && orderDetailData?.payBeforeActivation
								? t('button.continueToPay')
								: t('button.confirmOrder')
						}
						onPress={handleConfirmOrder}
						containerClassName="mb-[20px]"
					/>
				</CustomFooter>
			</View>
			<Loader
				loading={
					isSimOrderCartLoading || isPaymentLoading || isOrderDetailsLoading
				}
			/>
		</>
	);
};

export default ConfirmOrder;

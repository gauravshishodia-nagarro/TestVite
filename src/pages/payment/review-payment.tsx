import { UAT_BASE_URL } from '../../apis/axiosInstance';
import { queryKeys } from '../../apis/queryKeys';
import { useUpdateDeliverySlotDeviceOrderMutation } from '../../apis/services/delivery';
import {
	useFreeDeviceStockMutation,
	useItemStockQuery,
	useProductContractQuery,
} from '../../apis/services/devicesInventory';
import {
	useApplyCouponMutation,
	useDeleteCouponMutation,
	useOrderCartQuery,
} from '../../apis/services/orderManagement';
import {
	useAddApplePayCardMutation,
	useInstallmentMethodQuery,
	useMultilineRenewPaymentMutation,
	usePayment,
	usePaymentCardsQuery,
	useSetCardDefaultMutation,
	useTamamOfferMutation,
} from '../../apis/services/payment';
import {
	useCreateMultilineRenewalCart,
	useMultilineExpiredPackagesQuery,
	useMultilineGroupCreateCart,
	usePackageCartMutation,
} from '../../apis/services/telcoProvision';
import { useWalletBalanceQuery } from '../../apis/services/wallet';
import {
	RedeemPointResponse,
	SendReedeemOTPResponse,
} from '../../apis/types/mokafaa';
import {
	ApplePayRequest,
	CardResponse,
	InstallmentMethodsResponse,
	PaymentPayload,
} from '../../apis/types/payment';
import { PackageType } from '../../apis/types/store';
import {
	MultilineCreateCartResponse,
	OrderDetails,
} from '../../apis/types/telcoProvision';
import AcceptedCards from '../../components/acceptedCards';
import { AutoRenewCard } from '../../components/autoRenewCard';
import CouponCard from '../../components/couponCard';
import CustomButton from '../../components/customButton';
import CustomCheckbox from '../../components/customCheckbox';
import CustomFooter from '../../components/customFooter';
import CustomText from '../../components/customText';
import DataPackageCard from '../../components/dataPackageCard';
import DeliveryAddressCard from '../../components/deliveryAddressCards';
import Divider from '../../components/divider';
import HtmlTextRenderer from '../../components/htmlTextRenderer';
import GenericImage from '../../components/image';
import InfoPill from '../../components/infoPill';
import Loader from '../../components/loader';
import { isDataPackage } from '../../components/packageDetails';
import { isBNPLOptionDisbaled } from '../../components/paymentOptions';
import PriceWithCurrencey from '../../components/priceWithCurrencey';
import RadioButton from '../../components/radioButton';
import Section from '../../components/section';
import SectionItem from '../../components/sectionItem';
import Separator, { DashedSeparator } from '../../components/separator';
import SVGIcon from '../../components/svgIcon';
import TransactionDetailItem from '../../components/transactionDetailItem';
import constants from '../../configs/constants';
import { Colors } from '../../configs/themes';
import {
	APPLE_MERCHANT_IDENTIFIER,
	PaymentStatus,
	hasApplePayWithActiveCard,
	performGroupPayment,
	performPayment,
} from '../../helpers/applePayHelper.web';
import { AddCardSheetProps } from '../../sheets/addCardSheet';
import { ShowCardSheetProps } from '../../sheets/showCardsSheet';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';
import { useCustomAlertStore } from '../../stores/useCustomAlert';
import { useFloatingToastStore } from '../../stores/useFloatingToastStore';
import { useStepProgressStore } from '../../stores/useStepProgressStore';
import { useThreeDSecurePaymentStore } from '../../stores/useThreeDSecurePaymentStore';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import {
	APayRequestDataTypeExtended,
	EarnedMokafaaPointType,
	PAYMENT_INSTALLMENT_METHOD,
	RenewMultilineOrderDetailsType,
	SIM_TYPE,
} from '../../types';
import {
	formatDate,
	getDateFromTimestamp,
    getMinValueForTamam,
    isRTL
} from '../../utils/formatter';
import { getCardImage } from '../../utils/image';
import { CURRENCY, PaymentEvent } from '../../utils/payfort';
import {
	closeSheetModal,
	replaceTelcoTokenWithChild,
} from '../../utils/util';
import { NavigationProp, StackActions, useFocusEffect } from '@react-navigation/native';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { mutationKeys } from '../../apis/mutationKeys';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Share,
	View,
	useWindowDimensions,
} from 'react-native';
import { APayRequestDataType, ApplePay } from 'react-native-apay';
import Svg, { Line } from 'react-native-svg';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { useAppTranslation } from '../../hooks/useAppTranslation';

type PaymentRouteParams = {
    Payment: {
        type: string;
        id: string;
        processAdvancePayment?: boolean;
        paymentLink?: string;
    };
};

const getContinueBtnText = (
	paymentMethod: string,
	isAutoRenewEnabled: boolean,
    t: any
) => {
	const textPrefix = isAutoRenewEnabled
		? t('button.subscribeWith')
		: t('button.payWith');
	let result = {
		text: t('button.checkOut'),
		image: null,
	};

	switch (paymentMethod) {
		case 'apple':
			result = {
				text: textPrefix,
				image: require('../../../public/images/aPay.webp'),
			};
			break;
		case 'googlePay':
			result = {
				text: textPrefix,
				image: require('../../../public/images/gPay.webp'),
			};
			break;
		case 'bnpl':
			result = {
				text: t('button.checkOut'),
				image: null,
			};
			break;
		case 'creditDebitCard':
			result = {
				text: isAutoRenewEnabled
					? t('button.checkoutWithAutoRenew')
					: t('button.checkOut'),
				image: null,
			};
			break;
	}

	return result;
};

// const renewPackage = {
// 	sku: 'package_mini_x',
// 	name: 'Minix',
// 	price: 67.0,
// 	type: 'Voice',
// 	simType: 'SIM',
// 	number: '05 234 12345',
// 	vat: 9.0,
// 	deliveryCharges: 10,
// 	expiryDate: '16th Aug, 2025',
// 	daysLeft: 1,
// };
const multiLineCoupons = [
	{
		couponCode: 'RENEW15OFF',
		couponDescription: 'Save 12 SAR, 15% off & 10GB extra',
		appliedOnText: '05 234 00002',
	},
	{
		couponCode: 'RENEW5OFF',
		couponDescription: 'Save 12 SAR, 15% off & 10GB extra',
		appliedOnText: '05 234 00002',
	},
	{
		couponCode: 'RENEW25OFF',
		couponDescription: 'Save 12 SAR, 15% off & 10GB extra',
		appliedOnText: '05 234 00002',
	},
];
export const coupons = [
	{
		title: 'Recommended coupon for you',
		coupons: [
			{
				couponCode: 'RENEW15OFF',
				couponDescription: (
					<View className="flex-row">
						<CustomText
							fontVarient="regular"
							className="text-secondary-green text-xs"
						>
							Save
						</CustomText>
						<PriceWithCurrencey
							height={12}
							customTextClassName={`text-secondary-green ${constants.fontPrimaryMedium} text-xs`}
							bgColor="rgba(117, 160, 135, 1)"
							price={12}
						/>
						<CustomText
							className={`text-secondary-green ${constants.fontPrimaryMedium} text-xs`}
						>
							& 10GB{' '}
							<CustomText
								fontVarient="regular"
								className="text-secondary-green text-xs"
							>
								extra on pack
							</CustomText>
						</CustomText>
					</View>
				),
				appliedOnText: '054643212',
				discountText: '15% off',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
		],
	},
	{
		title: 'Available coupons',
		coupons: [
			{
				couponCode: 'FIRSTRENEW',
				couponDescription: 'Save SAR 9 on your package price',
				discountText: '10% off',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
			{
				couponCode: 'EXTRADATA',
				couponDescription: 'Enjoy extra 10GB on your data',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
			{
				couponCode: 'EXTRADATA4',
				couponDescription: 'Enjoy extra 10GB on your data',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
			{
				couponCode: 'EXTRADATA1',
				couponDescription: 'Enjoy extra 10GB on your data',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
			{
				couponCode: 'EXTRADATA0',
				couponDescription: 'Enjoy extra 10GB on your data',
				infoText: [
					'Get 15% discount on package price & 10 GB extra on renewal',
					'Save 20SAR (90SAR to 67SAR)',
				],
				infoTextHeading: 'Terms & Conditions',
			},
		],
	},
];

const CreditCardView = memo(
	({
		card,
		openShowCardSheet,
	}: { card: CardResponse | undefined; openShowCardSheet: () => void }) => {
		const { fontPrimaryRegular, fontPrimaryMedium } = constants;
        const {t: strings} = useAppTranslation();
		if (!card) {
			return null;
		}
		const { card_holder_name = '', card_number = '' } = card;
		console.log('card in credit card view', card);
		return (
			<View className="flex-row items-center mt-2 w-full">
				<GenericImage
					uri={getCardImage(card)}
					width={'w-[25px]'}
					height={'h-[16px]'}
					resizeMode="contain"
				/>
				<CustomText
					className={`text-xs text-shades-gray-02 flex-1 ms-2 ${Platform.OS === 'web' && isRTL() ? 'text-end' : 'text-left'} ${fontPrimaryRegular}`}
				>
					{`${card_holder_name ?? ''} ${card_number?.slice(-8) ?? ''}`}
				</CustomText>
				<Pressable onPress={() => openShowCardSheet()}>
					<CustomText
						className={`text-sm text-secondary-blue -me-6 ${fontPrimaryMedium}`}
					>
						{strings('button.edit')}
					</CustomText>
				</Pressable>
			</View>
		);
	},
);

const ExpiryInfo = memo(
	({
		expiryDate,
		daysLeft,
	}: {
		expiryDate: string; // e.g., '16th Aug, 2025'
		daysLeft: string; // e.g., '1 day'
	}) => {
		const { fontPrimaryMedium, fontPrimaryRegular } = constants;
        const {t: strings} = useAppTranslation();
		return (
			<View className="flex-row items-center border-t border-t-shades-purple-06 pt-3">
				<CustomText
					className={`${fontPrimaryRegular} text-shades-gray-01 text-xs flex-1  ${Platform.OS === 'web' && isRTL() ? 'text-end' : 'text-left'}`}
				>
					{`${strings('common.expiresOn')} `}
					<CustomText
						className={`${fontPrimaryMedium} text-shades-gray-01 text-sm`}
					>
						{expiryDate}
					</CustomText>
				</CustomText>
				<InfoPill
					texts={[
						{
							text: daysLeft.concat(' day'),
							textClassName: '!text-sm',
							weight: 'bold',
						},
						{ text: 'left', textClassName: '!text-xs' },
					]}
					mainContainerClassName="bg-shades-purple-06 items-center !px-3"
				/>
			</View>
		);
	},
);

const DeliveryAddressFooter = React.memo(
	({ orderCartData }: { orderCartData: OrderDetails }) => {
		const { theme, phoneNumber } = useUserPreferenceStore();
        const {t: strings} = useAppTranslation();
		return (
			<>
				<View className="flex-row gap-1">
					<CustomText
						fontVarient="regular"
						className="text-sm text-shades-gray-01"
					>
						{strings('common.phoneNumber')}:{' '}
					</CustomText>
					<CustomText
						fontVarient="medium"
						className="text-sm text-shades-gray-01"
					>
						{`0${phoneNumber}`}
					</CustomText>
				</View>
				<View className="mt-3">
					<Separator color={Colors[theme].shadesPurple06} thickness={1} />
					<CustomText
						fontVarient="regular"
						className="text-xs text-shades-gray-04 mt-3 pb-1"
					>
						{strings('label.dateandtimeslot')}
					</CustomText>
					<CustomText
						fontVarient="regular"
						className="text-sm text-secondary-gray"
					>
						{/* {moment(Number(orderCartData?.deliveryDetails?.time))
							.locale(getLocaleInitials())
							.format('DD MMM, YYYY')} */}
						{formatDate(orderCartData?.deliveryDetails?.time)}
					</CustomText>
				</View>
			</>
		);
	},
);

export const CouponFooter = ({
	openCouponSheet,
	buttonClassName,
	separatorClassName,
}: {
	openCouponSheet: () => void;
	buttonClassName?: string;
	separatorClassName?: string;
}) => {
	const theme = useUserPreferenceStore((state) => state.theme);
    const {t: strings} = useAppTranslation();

	return (
		<>
			<DashedSeparator
				color={Colors[theme].shadesPurple06}
				dashLength={8}
				dashGap={4}
				thickness={2}
				containerClassName={`px-4 ${separatorClassName}`}
			/>
			<Pressable
				onPress={openCouponSheet}
				className={`flex-row justify-between items-center px-4 pt-3 pb-4 ${buttonClassName}`}
			>
				<CustomText
					fontVarient="medium"
					className="text-sm text-secondary-blue"
				>
					{strings('common.ViewAllCoupons')}
				</CustomText>
				<SVGIcon
					name="arrow"
					style={{
						transform: [{ rotate: isRTL() ? '180deg' : '0deg' }],
					}}
				/>
			</Pressable>
		</>
	);
};

type SelectedSku = {
	sku: string;
	lineId: string;
};

const Payment: React.FC = () => {
	const navigation = useNavigation<NavigationProp<any>>();

	// const { type, id, processAdvancePayment = false } = useLocalSearchParams();
    const route = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();

    const { type, id, processAdvancePayment = false, paymentLink: routePaymentLink } = route.params || {};

	const {
		paymentFor,
		fontPrimaryBold,
		fontPrimaryRegular,
		fontPrimaryMedium,
		paymentMethod,
		successFlowType,
	} = constants;
	const {
		theme,
		phoneNumber,
		name,
		nationalOrIqamaId,
		isMultilineLogin,
		userId,
		emailId,
		userType,
	} = useUserPreferenceStore();
	const { height: windowHeight, width: windowWidth } = useWindowDimensions();
	const maxSheetHeight = windowHeight * 0.9;
	const [coupon, setCoupon] = useState('');
	const [isAutoRenewEnabled, setAutoRenewEnabled] = useState(false);
	const [tandcChecked, markTCChecked] = useState(false);
	const [selectedPaymentType, setSelectedPaymentType] = useState(
		paymentMethod.creditDebitCard,
	);
	const [walletAmountToUse, setWalletAmountToUse] = useState(0);

	const isMultiLineRenewal =
		type === paymentFor.renewPackage && isMultilineLogin;
	const showAlert = useCustomAlertStore((state) => state.showAlert);
	const {
		simType,
		selectedNumber,
		journeyName,
		deviceDetails,
		setJourneyState,
		termsAccepted,
		requestedMsisdnInOrderDetails,
	} = userJourneyStore();

	const deviceRef = useRef(deviceDetails);
	const packageCartMutationFiredRef = useRef(false);

	const setActiveSheet = useBottomSheetStore((state) => state.setActiveSheet);
	const showToast = useFloatingToastStore((state) => state.showToast);

	const [selectedSkus, setSelectedSkus] = useState<SelectedSku[]>([]);
	const [showApplePayButton, setApplePayButton] = useState(false);

	// const pathname = usePathname();
	const { setProgress, totalSteps, gotoNextStep } = useStepProgressStore();
	const queryClient = useQueryClient();

	const {
		data: paymentCardsData,
		isLoading: paymentCardLoading,
		refetch: refetchPaymentCards,
	} = usePaymentCardsQuery();

	const {
		data: packageCartData,
		isPending: packageCartLoading,
		mutateAsync: packageCartMutation,
	} = usePackageCartMutation();
	const isPackageCartMutating = useIsMutating({ mutationKey: [mutationKeys.packageCart] });
	const { mutateAsync: setCardDefaultMutation } = useSetCardDefaultMutation();

	// const { isLoading: isOrderDetailsLoading, data: orderDetailData } =
	// 	useGetOrderDetailsQuery();
    const {t: strings} = useAppTranslation();

	const {
		// data: orderCartData,
		isLoading: orderCartLoading,
		refetch: refetchOrderCartQuery,
	} = useOrderCartQuery(
		type === paymentFor.addApps || type === paymentFor.orderDevice
			? id.toString() //order id
			: packageCartData?.orderId || '',
	);

	const { isPending: isPaymentLoading, mutateAsync: paymentMutation } =
		usePayment();

	const {
		mutateAsync: applyCouponMutation,
		isPending: isApplyCouponInProgress,
	} = useApplyCouponMutation();
	const {
		mutateAsync: deleteCouponMutation,
		isPending: isDeleteCouponInProgress,
	} = useDeleteCouponMutation();

	const { refetch: refetchItemStock } = useItemStockQuery(
		deviceDetails?.sku || '',
		{ pickupLocationCode: deviceDetails?.pickupLocationCode || '' },
		true,
	);

	const { mutateAsync: freeDeviceStockMutation } = useFreeDeviceStockMutation(
		deviceRef?.current?.sku,
	);

	const { data: productContract } = useProductContractQuery(deviceDetails?.sku);
	const { data: installmentMethods, isLoading: isInstallmentMethodsLoading } =
		useInstallmentMethodQuery(
			{ totalAmount: deviceDetails?.price ?? '0' },
			type === paymentFor.orderDevice,
		);

	const {
		isPending: tamamOfferLoading,
		mutateAsync: tamamOfferMutation,
		data: tamamOffers,
	} = useTamamOfferMutation();

	const {
		isPending: isUpdateSlotLoading,
		mutateAsync: updateDeviceOrderSlotMutation,
	} = useUpdateDeliverySlotDeviceOrderMutation();

	const {
		data: multilineExpriedPackagesData,
		isLoading: fetchingMultilineExproedPackages,
	} = useMultilineExpiredPackagesQuery(
		id?.toString() ?? '',
		isMultiLineRenewal,
	);

	const {
		isPending: multilineCreateCartInProgress,
		mutateAsync: multilineCreateCartMutation,
	} = useCreateMultilineRenewalCart();

	const {
		isPending: multilineGroupCartInProgress,
		mutateAsync: multilineGroupCarttMutation,
	} = useMultilineGroupCreateCart();
	const {
		isPending: multilinePaymentInProgress,
		mutateAsync: multilinePaymentMutation,
	} = useMultilineRenewPaymentMutation();

	const {
		mutateAsync: addApplePayCardMutation,
		isPending: isAddApplePayCardPending,
	} = useAddApplePayCardMutation();

	const { data: walletBalanceData } = useWalletBalanceQuery();

	const responsesGroupCartRef = useRef<MultilineCreateCartResponse[]>([]);
	const packageCartLastCalledAt = useRef<number>(0);

	const [orderCartData, setOrderCartData] = useState<OrderDetails>();
	const isPaymentInitializing = (isPackageCartMutating > 0) || (!orderCartData && !!packageCartData);
	const [groupId, setGroupId] = useState<string>();

	const [
		multilineRenewTransactionDetails,
		setMultilineRenewTransactionDetails,
	] = useState<RenewMultilineOrderDetailsType>();

	const [multilineEligableMokaffaPoint, setMultilineEligableMokaffaPoint] =
		useState<EarnedMokafaaPointType>();

	const [hasCouponApllied, setCouponApplied] = useState(true);

	const requestedMsisdn =
		selectedNumber?.msisdn ?? requestedMsisdnInOrderDetails ?? phoneNumber;

	const renewPackage = useMemo(() => {
		return (
			packageCartData?.packageDetails ||
			multilineExpriedPackagesData?.expiredPackages?.find(
				(item) => item.lineId === userId,
			)?.incentivePackageDetails ||
			{}
		);
	}, [packageCartData, multilineExpriedPackagesData, userId]) as PackageType;

	const otherRenewPackages = useMemo(() => {
		return (
			multilineExpriedPackagesData?.expiredPackages?.filter(
				(item) => item.lineId !== userId,
			) ?? []
		);
	}, [multilineExpriedPackagesData, userId]);

	const checkOutCardInfo = useMemo(() => {
		if (type === paymentFor.orderDevice) {
			return {
				...deviceDetails,

				options: deviceDetails?.selectedVariant,
			};
		}
		if (type === paymentFor.addApps) {
			return {
				imageUrl: require('../../../public/images/demo/ticktok.png'), // static image for not need to change once designer provides
				price: orderCartData?.items?.[0].price,
				name: orderCartData?.items?.[0].title,
				options: {
					validity: {
						id: 'validity',
						title: strings('common.days')?.replace(
							'{number}',
							orderCartData?.items?.[0].validty || '',
						),
					},
				},
			};
		}
	}, [orderCartData, deviceDetails, paymentFor, type]);

	const savedCards = paymentCardsData?.cards ?? [];
	const hasSavedCreditCard = paymentCardsData?.cards.length;
	const [selectedBNPL, setSelectedBNPL] =
		useState<InstallmentMethodsResponse | null>(null);

	useEffect(() => {
		console.log('gaurav packageCartData', packageCartData);
	}, [packageCartData])

	const getCard = useCallback(
		(showDefaultCard: boolean) => {
			if (showDefaultCard) {
				return (
					savedCards?.find((card) => card.is_default_card) ?? savedCards?.[0]
				);
			} else {
				return savedCards?.[0];
			}
		},
		[savedCards],
	);

	const [selectedCard, setSelectedCard] = useState<CardResponse>(getCard(true));
	const [cvv, setCVV] = useState<string>('');

	useEffect(() => {
		async function checkApplePay() {
			if (Platform.OS === 'ios') {
				setApplePayButton(true);
				return;
			}
			if (Platform.OS === 'web') {
				try {
					const available = await hasApplePayWithActiveCard(
						APPLE_MERCHANT_IDENTIFIER,
					);
					console.log('APPLE_PAY1', available);
					setApplePayButton(true);
				} catch (err) {
					console.warn('Apple Pay detection failed1', err);
					setApplePayButton(false);
				}
			}
		}

		checkApplePay();
		// if (Platform.OS === 'ios') {
		// 	setApplePayButton(true);
		// 	return;
		// }
		// if (Platform.OS === 'web') {
		// 	isApplePayJsAvailable()
		// 		.then((enable: boolean) => {
		// 			console.log('APPLE_PAY', enable);
		// 			setApplePayButton(true);
		// 		})
		// 		.catch((e) => {
		// 			console.log('APPLE_PAY', e);
		// 			setApplePayButton(false);
		// 		});
		// }
	}, []);

	useEffect(() => {
		if (deviceDetails && type === paymentFor.orderDevice) {
			tamamOfferMutation({ amount: Number(deviceDetails?.price) }).then((res) =>
				console.log(res),
			);
			// .catch((err) => alert(err?.message));
		}
	}, [deviceDetails, type, paymentFor]);

	useEffect(() => {
		if (termsAccepted) {
			markTCChecked(true);
		}
	}, [termsAccepted, navigation]);

	useEffect(() => {
		if (savedCards.length > 0) {
			console.log('setting default card');
			setSelectedCard(getCard(true));
		}
	}, [savedCards, getCard]);

	useFocusEffect(
		useCallback(() => {
			// setProgress(
			// 	simType === SIM_TYPE.ESIM ? (totalSteps === 5 ? 3 : 2) : totalSteps,
			// );
			gotoNextStep();
		}, [gotoNextStep]),
	);

	useEffect(() => {
		packageCartMutationFiredRef.current = false;
	}, [id, type, processAdvancePayment]);

	useEffect(() => {

		if (id && type !== paymentFor.addApps && type !== paymentFor.orderDevice) {

			if (isMultiLineRenewal) return;
			if (routePaymentLink) return;
			if (packageCartMutationFiredRef.current || isPackageCartMutating || packageCartLoading || packageCartData) return;

			packageCartMutationFiredRef.current = true;
			packageCartMutation({
				package_sku: id as string,
				...(type === paymentFor.renewPackage && {
					processAdvancePayment: Boolean(processAdvancePayment),
				}),
			})
				.then((response) => {
					console.log("Gaurav Then :",response);
				})
				.catch((error) => {
					packageCartMutationFiredRef.current = false;
					// navigateToHome(); //alert(error?.message);
					// alert(error?.message)
					console.log("Gaurav Catch :",error);
				});
		}
	}, [
		id,
		type,
		paymentFor,
		processAdvancePayment,
		isMultiLineRenewal,
	]);

	// useEffect(() => {
	// 	//adding default package sku
	// 	if (renewPackage?.sku) {
	// 		     ([renewPackage.sku]);
	// 	}
	// }, [renewPackage]);

	useEffect(() => {
		if (
			packageCartData?.orderId ||
			type === paymentFor.addApps ||
			type === paymentFor.orderDevice
		) {
			refetchOrderCartQuery().then((response) =>
				setOrderCartData(response?.data),
			);
		}
	}, [packageCartData, refetchOrderCartQuery, type, paymentFor]);

	useEffect(() => {
		return () => {
			if (deviceRef?.current?.sku) {
				freeDeviceStockMutation({
					status: 'RELEASED',
				});
			}
		};
	}, []);

	// for multiline create cart
	useEffect(() => {
		if (isMultiLineRenewal && userId) {
			callMultilineCreateCartAPI(userId, String(id));
		}
	}, [id, userId, isMultiLineRenewal]);

	//when sku updates then update trnasaction details
	useEffect(() => {
		if (selectedSkus) {
			updateMultilineTransactionDetails();
		}
	}, [selectedSkus]);

	const navigateToHome = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'tabs' }],
		});
	};

	const callMultilineCreateCartAPI = (lineid: string, sku: string) => {
		multilineCreateCartMutation({
			lineId: lineid,
			packageSku: sku,
		})
			.then((response) => {
				// setSelectedSkus((prev) => [...(prev ?? []), sku]);
				setSelectedSkus((prev) => {
					const list = prev ?? [];
					const exists = list.some((item) => item.lineId === lineid);
					return exists ? list : [...list, { sku, lineId: lineid }];
				});

				responsesGroupCartRef.current.push(response);
			})
			.catch(() => {
				//alert(error?.message);
				if (lineid === userId) {
					navigation.goBack();
				}
			});
	};

	const selectedPackages = useMemo(() => {
		if (isMultiLineRenewal) {
			// Select all matching packages based on selectedSkus
			return [
				selectedSkus.length === 1
					? renewPackage
					: {
							sku: 'multiline',
							name: strings('label.orderDetails'),
							price: multilineRenewTransactionDetails?.subtotal,
						},
				//renewPackage,
				// ...otherEligiblePackages.filter((item) =>
				// 	selectedSkus?.includes(item.sku),
				// ),
				// do not delete the above code, this we will use for multiline renew
			];
		} else if (type === paymentFor.orderDevice) {
			return [
				{
					sku: deviceDetails?.sku,
					name: deviceDetails?.name,
					price: Number(deviceDetails?.price),
				},
			] as PackageType[];
		} else if (type === paymentFor.addApps) {
			return [
				{
					sku: orderCartData?.items?.[0].sku,
					name: orderCartData?.items?.[0].subtitle,
					price: orderCartData?.items?.[0].price,
				},
			] as PackageType[];
		} else {
			// Wrap the single selected package in an array
			return [renewPackage] as PackageType[];
		}
	}, [
		type,
		paymentFor,
		renewPackage,
		deviceDetails,
		orderCartData,
		multilineRenewTransactionDetails,
		selectedSkus,
		isMultiLineRenewal,
	]);

	const toggleSku = useCallback((sku: string, lineId: string) => {
		const cartItem = responsesGroupCartRef.current.find(
			(item) => item.packageSku === sku && item.lineId === lineId,
		);

		if (!cartItem) {
			callMultilineCreateCartAPI(lineId, sku);
		} else {
			// setSelectedSkus((prev) => {
			// 	const updatedSkus = prev?.includes(sku)
			// 		? prev.filter((item) => item !== sku)
			// 		: [...(prev ?? []), sku];

			// 	return updatedSkus;
			// });
			setSelectedSkus((prev) => {
				const list = prev ?? [];
				const exists = list.some((item) => item.lineId === lineId);
				return exists
					? list.filter((item) => item.lineId !== lineId)
					: [...list, { sku, lineId }];
			});
		}
	}, []);

	const updateMultilineTransactionDetails = () => {
		const initialOrderDetails: RenewMultilineOrderDetailsType = {
			cartTotalWithTax: 0,
			discountAmount: 0,
			taxAmount: 0,
			subtotal: 0,
			vatPercent: 0,
		};
		const initialMokafaaEarnedPoints: EarnedMokafaaPointType = {
			subTotal: 0.0,
			discount: 0.0,
			mokafaaEligible: false,
			multiplyingFactorMokafaa: 0,
		};
		const selectedCarts = getMultilineSelectedPackagesCard();
		selectedCarts?.map((item: MultilineCreateCartResponse) => {
			initialOrderDetails.cartTotalWithTax += Number.parseFloat(
				item.cartTotalWithTax,
			);
			initialOrderDetails.subtotal += Number.parseFloat(item.subtotal);
			initialOrderDetails.discountAmount += Number.parseFloat(
				item.discountAmount,
			);
			initialOrderDetails.taxAmount += Number.parseFloat(item.taxAmount);
			initialOrderDetails.vatPercent =
				item.taxPercent > 0 ? item.taxPercent : initialOrderDetails.vatPercent;
			// calculate mokafaa earned points
			if (item?.mokafaaEligible) {
				initialMokafaaEarnedPoints.subTotal += Number.parseFloat(item.subtotal);
				initialMokafaaEarnedPoints.discount += Number.parseFloat(
					item.discountAmount,
				);
				if (!initialMokafaaEarnedPoints.mokafaaEligible) {
					initialMokafaaEarnedPoints.mokafaaEligible = true;
				}
				initialMokafaaEarnedPoints.multiplyingFactorMokafaa =
					item.multiplyingFactorMokafaa;
			}
		});
		setMultilineRenewTransactionDetails(initialOrderDetails);
		setMultilineEligableMokaffaPoint(initialMokafaaEarnedPoints);
	};

	const getMultilineSelectedPackagesCard = () => {
		// return responsesGroupCartRef?.current?.filter((item) =>
		// 	selectedSkus?.includes(item.packageSku),
		// );
		return responsesGroupCartRef?.current?.filter((item) =>
			selectedSkus?.some((selected) => selected.lineId === item.lineId),
		);
	};

	const navigateToSuccess = () => {
		//complete the progress before moving to next screen
		setProgress(totalSteps + 1);
		if (type === paymentFor.addApps) {
                navigation.dispatch(
                    StackActions.replace(
                        'SuccessScreen',
                        {
                            type: successFlowType.addAppSuccess
                        },
                ));
		} else if (type === paymentFor.orderDevice) {
            //commented since order device is not part scope (only esim)
			// router.replace({
			// 	pathname: '/[type]/success',
			// 	params: {
			// 		type: successFlowType.orderDeviceSuccess,
			// 		address: orderCartData?.deliveryDetails?.address ?? '',
			// 		orderNumber: '05234123232',
			// 		dateTime: formatDate(orderCartData?.deliveryDetails?.time),
			// 	},
			// });
		} else if (type === paymentFor.renewPackage) {
			if (isMultiLineRenewal) {
				// setJourneyState({
				// 	multilineRenewPackages:
				// 		multilineExpriedPackagesData?.expiredPackages?.filter((item) =>
				// 			selectedSkus.includes(item.packageSku),
				// 		),
				// });
				setJourneyState({
					multilineRenewPackages:
						multilineExpriedPackagesData?.expiredPackages?.filter((item) =>
							selectedSkus?.some((selected) => selected.lineId === item.lineId),
						),
				});

                navigation.dispatch(
                    StackActions.replace(
                        'SuccessScreen',
                        {
                            type: successFlowType.multilineRenewal,
                        },
                ));
			} else {

                navigation.dispatch(
                    StackActions.replace(
                        'SuccessScreen',
                        {
                        type: successFlowType.renewPackage,
						isMultiline: String(isMultiLineRenewal),
						packageName: renewPackage.name,
						packageType:
							renewPackage?.package_for === 'esim'
								? strings('common.eSim')
								: strings('common.sim'),
						mobileNumber: requestedMsisdn,
						packageLogo: renewPackage?.package_logo_image,
                        },
                ));
			}
		} else if (simType === SIM_TYPE.ESIM) {
			replaceTelcoTokenWithChild();
            navigation.dispatch(
                StackActions.replace(
                    'SuccessScreen',
                    {
                        type: successFlowType.orderPaymet,
                    },
            ));
		} else {
			// replaceTelcoTokenWithChild();
			// router.replace({
			// 	pathname: '/activation/processing-package',
			// }); 
            // since processing package screen is not part of the scope, directly navigating to success screen
		}
	};

	const handlePaymentMutationSuccess = (response: any) => {
		if (selectedPaymentType === paymentMethod.apple) {
			ApplePay.complete(ApplePay.SUCCESS).then(() => {
				setTimeout(() => navigateToSuccess(), 1000);
			});
		} else if (response.eventName === PaymentEvent.PAYMENT_SUCCESSFUL) {
			navigateToSuccess();
		} else if (
			response.eventName === PaymentEvent.PAYMENT_3D_NEEDED ||
			response.eventName === 'CUSTOMER_INFO_REQUIRED'
		) {
			const { setWebViewSource, setCallback } =
				useThreeDSecurePaymentStore.getState();
			setWebViewSource({ uri: response?.urlSecure });
			setCallback('onMessage', handlePostMessages);
			setCallback('onNavigationStateChange', onNavigationStateChange);
			navigation.navigate('threeDSecurePayment');
		} else {
			alert(response?.message ?? 'Something went wrong in Payment');
		}
	};

	const handleContinue = () => {
		if (type === paymentFor.orderDevice && !selectedBNPL) {
			refetchItemStock().then(() => handlePayment());
			// .catch((error) => alert(error?.message));
		} 
        // else if (isMultiLineRenewal && !isWeb()) { mobile is out of scope 
		// 	callCreateMultilineGroupAPI(false);
		// }
        else {
			handlePayment();
		}
	};
	const callCreateMultilineGroupAPI = (isFromMokafaa: boolean) => {
		multilineGroupCarttMutation(
			getMultilineSelectedPackagesCard()?.map((item) => {
				return {
					lineId: item.lineId,
					orderId: item.orderId,
					groupOrderId: groupId ? groupId : null,
				};
			}),
		).then((response) => {
			const groupId = response?.groupOrderId;
			setGroupId(groupId);
			if (isFromMokafaa) {
				openMokafaaNumberSheet();
			} else {
				handlePayment(response?.groupOrderId);
			}
		});
		// .catch((error) => alert(error?.message));
	};

	const handlePayment = (groupOrderId = '') => {
		if (selectedPaymentType === paymentMethod.creditDebitCard && !cvv) {
			openShowCardSheet();
			return;
		}
		if (
			selectedPaymentType === paymentMethod.creditDebitCard &&
			savedCards?.length > 0
		) {
			callPaymentAPI({
				cardId: selectedCard?.id,
				cvv: cvv,
				orderId: orderCartData?.orderId ?? '',
				orderType: orderCartData?.orderType,
				email: orderCartData?.email ?? '',
				groupOrderId,
				payForAutoRenewal: isAutoRenewEnabled,
			});
		} else if (selectedPaymentType === paymentMethod.mokafaa) {
			callPaymentAPI({
				//cardId: 'MOKAFAA',
				cvv: '',
				orderId: orderCartData?.orderId ?? '',
				orderType: orderCartData?.orderType,
				email: orderCartData?.email ?? '',
				paymentOptionFlag: 'MOKAFAA',
				groupOrderId,
			});
		} else if (selectedPaymentType === paymentMethod.apple) {
			const total = getTotalAmount();
			const amount_ =
				total === 0 || total === 0.0
					? Number(1).toFixed(2)
					: Number(getTotalAmount()).toFixed(2);
			handleApplePay({
				amount: amount_,
				mode: 'PAYMENT',
				groupOrderId, // TODO: Need to check if its required to call or not
			});
		} else if (selectedPaymentType === paymentMethod.bnpl) {
			if (
				selectedBNPL?.payment_installment_method ===
					PAYMENT_INSTALLMENT_METHOD.TAMAM &&
				deviceDetails?.showSlotAlertForTamamPaymentOption
			) {
				if (deviceDetails?.nextSlotForSelection) {
					const date = getDateFromTimestamp(
						deviceDetails?.nextSlotForSelection,
                        useAppTranslation()
					);
					Alert.alert(
						strings('action.slotAlertTitle'),
						strings('action.slotAlertSubtitle').replace('-DATE-', date),
						[
							{
								text: 'OK',
								onPress: () => {
									updateDeviceOrderSlotMutation({
										orderId: orderCartData?.orderId ?? '',
										slot: deviceDetails?.nextSlotForSelection ?? 0,
									}).then(() => {
										callPaymentAPI({
											// cardId: selectedBNPL?.payment_installment_method, // no need to send cardID for BNPL as per Aditya Team A
											cvv: '',
											orderId: orderCartData?.orderId ?? '',
											orderType: orderCartData?.orderType,
											email: orderCartData?.email ?? '',
											national_id: nationalOrIqamaId,
											paymentOptionFlag:
												selectedBNPL?.payment_installment_method,
										});
									});
									// .catch((error) => alert(error?.message));
								},
							},
							{ text: 'Cancel' },
						],
					);
				} else {
					// TODO: required proper message
					alert(
						'Installment orders cannot be delivered in less than 24 hours.',
					);
				}
			} else {
				callPaymentAPI({
					// cardId: selectedBNPL?.payment_installment_method, // no need to send cardID for BNPL as per Aditya Team A
					cvv: '',
					orderId: orderCartData?.orderId ?? '',
					orderType: orderCartData?.orderType,
					email: orderCartData?.email ?? '',
					national_id: nationalOrIqamaId,
					paymentOptionFlag: selectedBNPL?.payment_installment_method,
					groupOrderId,
				});
			}
		}
		return;
	};

	const callPaymentAPI = (data: PaymentPayload) => {
		const email = multilineExpriedPackagesData?.email || emailId;
		if (isMultiLineRenewal) {
			multilinePaymentMutation({
				source: 'APP',
				cardId: data?.cardId,
				cvv: data?.cvv,
				groupOrderId: data?.groupOrderId,
				linkId: userId || '',
				...(email ? { email } : {}),
			}).then((response) => handlePaymentMutationSuccess(response));
			// .catch((error) => alert(error?.message));
		} else {
			paymentMutation(data).then((response) => {
				handlePaymentMutationSuccess(response);
			});
			// .catch((error) => alert(error?.message));
		}
	};

	const handlePostMessages = (rawEventData: any) => {
		try {
			// const data = JSON.parse(event.nativeEvent?.data ?? '{}');
			let data: any = {};

			if (rawEventData?.toLowerCase() === 'close') {
				alert(strings('error.abortPayment'));
				return;
			}

			if (rawEventData?.toLowerCase() === 'rejected') {
				alert(strings('error.rejectedTabbyTitle'));
				return;
			}

			data =
				typeof rawEventData === 'string'
					? JSON.parse(rawEventData)
					: rawEventData;
			const { eventName = '', message = '' } = data;
			if (
				selectedBNPL &&
				selectedBNPL?.payment_installment_method !== 'TAMAM' &&
				eventName !== PaymentEvent.PAYMENT_SUCCESSFUL
			) {
				alert(strings('error.genericPaymentTitle'));
				return;
			}
			if (!eventName) return;
			// Define error event set once (outside or memoized)
			const errorEvents = new Set([
				PaymentEvent.PAYMENT_CARD_VALIDATION_TOKENIZATION_FAILED,
				PaymentEvent.PAYMENT_CARD_VALIDATION_FAILED,
				PaymentEvent.PAYMENT_CARD_TOKENIZATION_FAILED,
				PaymentEvent.PAYMENT_INVALID_EXPIRY_DATE,
				PaymentEvent.PAYMENT_INSUFFICIENT_FUNDS,
				PaymentEvent.SOMETHING_WENT_WRONG,
			]);

			switch (eventName) {
				case PaymentEvent.PAYMENT_CARD_VALIDATION_COMPLETED:
					refetchPaymentCards().then((response) => {
						openShowCardSheet(response.data?.cards);
					});
					break;

				case PaymentEvent.PAYMENT_CARD_EXPIRED:
					alert(strings('label.cardExpiryErrorMsg'));
					break;
				case PaymentEvent.PAYMENT_SUCCESSFUL:
					setTimeout(() => {
						navigateToSuccess();
					}, 500);

					break;
				default:
					if (errorEvents.has(eventName)) {
						alert(message);
					}
					break;
			}
		} catch (error) {
			console.warn('Invalid WebView message data:', error);
		}
	};

	const onNavigationStateChange = (event: WebViewNavigation) => {
		console.log('HANDLE NAVIGATION STATE CHANGE:', event);

		const title = event.title?.trim();

		if (title === '500' || title === 'Error') {
			// Handle PayFort downtime or general error
			alert('Something went wrong');
		}
	};

	const handleCardPayment = () => {
		setSelectedPaymentType(paymentMethod.creditDebitCard);

		if (!hasSavedCreditCard) {
			openAddCardSheet(false);
		} else {
			openShowCardSheet();
		}
	};
	const openAddCardSheet = (isForSubscription = false) => {
		setActiveSheet('addCardSheet', {
			snapPoints: ['85%'],
			title: strings('label.addNewCard'),
			showBack: true,
			props: {
				handlePostMessages: handlePostMessages,
				onNavigationStateChange: onNavigationStateChange,
				continueLabel:
					isForSubscription === true
						? strings('button.saveAndSubscribe')
						: strings('button.saveAndContinue'),
				secondaryLabel:
					isForSubscription === true ? strings('button.maybeLater') : null,
				onPressSecondary: () =>
					isForSubscription === true ? closeSheetModal() : null,
			} as AddCardSheetProps,
		});
	};
	const openShowCardSheet = (cards?: CardResponse[]) => {
		setActiveSheet('showCardSheet', {
			snapPoints: ['85%'],
			title: strings('label.creditAndDebitCard'),
			props: {
				handleSelectedCard: handleSelectedCard,
				handleAddCard: addPaymentMethodSheet,
				cards: (cards || savedCards).filter((item) => !item.is_apple_pay),
			} as ShowCardSheetProps,
		});
	};

	const setAsDefaultCard = (card: CardResponse) => {
		setCardDefaultMutation({ id: card.id });
		refetchPaymentCards();
	};
	const handleSelectedCard = (card: CardResponse, cvv: string) => {
		closeSheetModal();
		setSelectedCard(card);
		setCVV(cvv);
		setAsDefaultCard(card);
	};
	type ApplePayMode = 'PAYMENT' | 'ADD_CARD';

	const parseApplePayPayload = (_paymentData: any) => {
		let firstPayload: any;

		try {
			const { paymentData, ...rest } = JSON.parse(_paymentData || '{}');
			firstPayload = { ...rest, ...JSON.parse(paymentData) };
		} catch {
			firstPayload = JSON.parse(_paymentData || '{}');
		}

		const { header, ...allOthers } = firstPayload;
		const payload = { ...header, ...allOthers };

		return {
			data: payload.data,
			signature: payload.signature,
			transactionId: payload.transactionId,
			ephemeralPublicKey: payload.ephemeralPublicKey,
			publicKeyHash: payload.publicKeyHash,
			displayName: payload.displayName,
			network: payload.network,
			type: payload.type,
		};
	};

	const handleApplePayWebResponse = (paymentStatus: PaymentStatus) => {
		console.log('ApplePayStatus', paymentStatus);
		switch (paymentStatus) {
			case PaymentStatus.CANCEL:
				console.log('APPLE_PAY', 'PaymentStatus', 'Cancel');
				break;
			case PaymentStatus.SUCCESS:
				navigateToSuccess();
				break;
			default:
				alert('Something went wrong');
				break;
		}
	};

	const handleApplePay = ({
		mode,
		amount,
		groupOrderId,
	}: {
		mode: ApplePayMode;
		amount: string;
		orderId?: string;
		groupOrderId?: string;
	}) => {
		const label = 'YAQOOT, ZAIN KSA';
		const requestData: APayRequestDataTypeExtended = {
			merchantIdentifier: APPLE_MERCHANT_IDENTIFIER,
			supportedNetworks: ['mastercard', 'mada', 'visa'],
			countryCode: 'SA',
			currencyCode: CURRENCY,
			paymentSummaryItems: [
				{
					label,
					amount: amount,
				},
			],
		};
		//TODO implement apple pay add card for web
		try {
			if (Platform.OS === 'web' && mode === 'PAYMENT') {
				if (!packageCartData?.paymentLink && !isMultiLineRenewal) {
					alert('Payment link not found');
					return;
				}
				const token = packageCartData?.paymentLink
					? new URL(packageCartData?.paymentLink).pathname.split('/').pop()
					: '';
				// if (!isApplePayAvailable()) {
				// 	alert('Apple pay is not supported');
				// 	return;
				// }
				// web call
				if (isMultiLineRenewal) {
					performGroupPayment({
						amount: Number(amount),
						currencyCode: CURRENCY,
						baseURL: UAT_BASE_URL,
						label,
						userId: userId || '',
						lindeDetails: getMultilineSelectedPackagesCard()?.map((item) => {
							return {
								lineId: item.lineId,
								orderId: item.orderId,
							};
						}),
					}).then((paymentStatus: PaymentStatus) => {
						handleApplePayWebResponse(paymentStatus);
					});
				} else {
					performPayment({
						amount: Number(amount),
						currencyCode: CURRENCY,
						baseURL: UAT_BASE_URL,
						label,
						token,
					}).then((paymentStatus: PaymentStatus) => {
						handleApplePayWebResponse(paymentStatus);
					});
				}
			} else if (ApplePay.canMakePayments) {
				ApplePay.requestPayment(requestData as APayRequestDataType)
					.then((_paymentData: any) => {
						console.log({ _paymentData });
						if (_paymentData && Object.keys(_paymentData).length) {
							const applePayPayload = parseApplePayPayload(_paymentData);

							// let firstPayload: any;
							// try {
							// 	const { paymentData, ...rest } = JSON.parse(
							// 		_paymentData || '{}',
							// 	);
							// 	firstPayload = { ...rest, ...JSON.parse(paymentData) };
							// } catch (err: any) {
							// 	console.log('err', err);
							// 	firstPayload = JSON.parse(_paymentData || '{}');
							// }
							// const { header, ...allOthers } = firstPayload;
							// const payload = { ...header, ...allOthers };
							if (mode === 'PAYMENT') {
								const data: PaymentPayload = {
									applePayPayload: applePayPayload,
									orderId: orderCartData?.orderId || '',
									payForAutoRenewal: isAutoRenewEnabled,
								};
								// dont send verified email in the api as it can be masked or unmasked
								if (orderCartData?.email && !orderCartData?.is_email_verified) {
									data.email = orderCartData?.email;
								}
								paymentMutation(data)
									.then((response) => {
										handlePaymentMutationSuccess(response);
									})
									.catch((error) => {
										ApplePay.complete(ApplePay.FAILURE).then(() =>
											setTimeout(() => alert(error?.message), 1000),
										);
									});
							} else {
								const data: ApplePayRequest = {
									applePayPayload: applePayPayload,
									isApplePay: true,
								};
								callApplePayAddCardAPI(data);
							}
						}
					})
					.catch((error: any) => console.log('error in apple pay', error));
			} else {
				// TODO: required design for this event
				console.log('Apple pay is not available');
			}
		} catch (exception: any) {
			console.log('Exception in ApplePay', exception);
		}
	};

	const callApplePayAddCardAPI = (payload: ApplePayRequest) => {
		addApplePayCardMutation(payload).then(() =>
			refetchPaymentCards().then((response) => {
				openShowCardSheet(response.data?.cards);
			}),
		);
		// .catch((err) => alert(err?.message));
	};
	const getTotalAmount = () => {
		console.log('gaurav isMultiLineRenewal', isMultiLineRenewal);
		console.log('gaurav multilineRenewTransactionDetails', multilineRenewTransactionDetails);
		console.log('gaurav packageCartData', packageCartData);
		console.log('gaurav orderCartData', orderCartData);
		if (isMultiLineRenewal) {
			return multilineRenewTransactionDetails?.cartTotalWithTax ?? 0;
		} else {
			return Number(packageCartData?.priceWithTax) || orderCartData?.priceBreakdown?.total || 0;
		}
	};

	const getDiscountAmount = () => {
		if (isMultiLineRenewal) {
			return multilineRenewTransactionDetails?.discountAmount ?? 0;
		} else {
			return Number(orderCartData?.priceBreakdown?.discount_amount ?? 0);
		}
	};

	const getVatAmout = () => {
		if (isMultiLineRenewal) {
			return multilineRenewTransactionDetails?.taxAmount ?? 0;
		} else {
			return orderCartData?.priceBreakdown?.vat_amount ?? 0;
		}
	};

	const getVatLabel = () => {
		return strings('label.vatPercentage').replace(
			'VATPERCENTAGE',
			(isMultiLineRenewal
				? multilineRenewTransactionDetails?.vatPercent
				: orderCartData?.priceBreakdown?.tax_percentage
			)?.toString() || '0',
		);
	};

	const handleApplyCoupon = (coupon: string) => {
		if (orderCartData?.orderId) {
			setCoupon(coupon);
			applyCouponMutation({
				orderId: orderCartData?.orderId,
				promoCode: coupon,
			}).then((response) => {
				if (
					!response?.promoCode?.isApplied &&
					response?.promoCode?.errorMessage
				) {
					alert(response?.promoCode?.errorMessage);
				} else {
					setOrderCartData((prev) =>
						prev ? { ...prev, priceBreakdown: response?.priceBreakdown } : prev,
					);
					showAlert({
						title: `${coupon} ${strings('common.applied')}`,
						message:
							'You saved 12 on your package price and have additional benefit of 10GB extra!',
						showConfetti: true,
					});
					setCouponApplied(true);
				}
			});
			// .catch((error) => alert(error?.message));
		}
	};
	const handleDeleteCoupon = () => {
		if (orderCartData?.orderId) {
			deleteCouponMutation({
				orderId: orderCartData?.orderId,
			}).then((response) => {
				setOrderCartData((prev) =>
					prev ? { ...prev, priceBreakdown: response?.priceBreakdown } : prev,
				);
				setCoupon('');
				setCouponApplied(false);
			});
			// .catch((error) => alert(error?.message));
		}
	};

	const onShare = async () => {
		try {
			const link =
				packageCartData?.paymentLink ||
				multilineExpriedPackagesData?.paymentLink ||
				'';
			await Share.share({
				message: link,
				title: strings('label.paymentLink'),
				url: link,
			});
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};
    const {t} = useAppTranslation();
	const paymentLabel = () => {
		const { text, image } = getContinueBtnText(
			selectedPaymentType,
			isAutoRenewEnabled,
            t
		);
		if (
			selectedPaymentType === 'creditDebitCard' ||
			selectedPaymentType === 'bnpl'
		) {
			return (
				<View className="flex-row self-center items-center">
					<View className="flex-row gap-3 items-center">
						<CustomText
							className={`text-base text-secondary-white ${fontPrimaryMedium}`}
						>
							{text}
						</CustomText>
						<Separator
							orientation="vertical"
							color={Colors[theme].secondaryWhite}
							style={{ height: 24 }}
						/>
						<PriceWithCurrencey
							price={getTotalAmount()}
							bgColor={Colors[theme].secondaryWhite}
							customTextClassName={`${fontPrimaryMedium} text-secondary-white text-base`}
							customDecimalTextClassName={'text-xs'}
						/>
					</View>
				</View>
			);
		}
		return (
			<View className="flex-row self-center items-center">
				<View className="flex-row gap-1 items-center">
					<CustomText
						className={`text-base text-secondary-white ${fontPrimaryMedium}`}
					>
						{text}
					</CustomText>
					{image ? (
						<GenericImage
							width="w-[59px]"
							height="h-[24px]"
							uri={image}
							resizeMode="contain"
						/>
					) : null}
				</View>
			</View>
		);
	};

	const handleTermsAndConditions = () => {
		if (type === paymentFor.orderDevice) {
			setJourneyState({ termsAccepted: false });
			queryClient.setQueryData([queryKeys.prodcutContract], productContract);

			// router.navigate({
			// 	pathname: '/devices/terms-and-conditions',
			// });
		}
	};

	const openOTPSheet = (
		sendOTPRespose: SendReedeemOTPResponse,
		mokaffaaNumber: string,
	) => {
		setActiveSheet('mokafaaOTPSheet', {
			snapPoints: ['80%'],
			title: strings('label.redeemMokafaaPoints'),
			showBack: true,
			onBackPress: () => {
				onPressMokafaa(false);
			},
			props: {
				initialTimeInSecond: sendOTPRespose.otp.otp_token_expired_in_min * 60,
				phoneNumber: mokaffaaNumber,
				onPressBack: () => {
					onPressMokafaa(true);
				},
				mokafaPoints: sendOTPRespose.multiplyingFactor * getTotalAmount(),
				price: getTotalAmount(),
				orderId: isMultiLineRenewal ? groupId : orderCartData?.orderId,
				isMultiLineRenewal: isMultiLineRenewal,
				onRedeemSuccess: (res: any) => {
					handleRedeemMokafaaPointSuccess(res);
				},
			},
		});
	};

	const handleRedeemMokafaaPointSuccess = (res: RedeemPointResponse) => {
		if (res.pointsAmount) {
			closeSheetModal();
			setSelectedPaymentType(paymentMethod.mokafaa);
		}
	};

	const onPressMokafaa = (isOn: boolean) => {
		if (!isOn) {
			setSelectedPaymentType(paymentMethod.apple);
			return;
		}
		isMultiLineRenewal
			? callCreateMultilineGroupAPI(true)
			: openMokafaaNumberSheet();
	};

	const openMokafaaNumberSheet = () => {
		setActiveSheet('mokafaaPhoneNumberSheet', {
			snapPoints: ['70%', '90%'],
			keyboardBehavior: 'fillParent',
			enableDynamicSizing: false,
			props: {
				onOTPSuccess: (res: SendReedeemOTPResponse, phoneNumber: string) => {
					openOTPSheet(res, phoneNumber);
				},
			},
		});
	};
	const onPressBNPL = () => {
		setActiveSheet('BNPLOptionsSheet', {
			snapPoints: ['90%'],
			title: strings('label.buyNowPayLater'),
			props: {
				installmentMethods: installmentMethods,
				tamamOffers: tamamOffers,
				selectedBNPLItem: selectedBNPL,
				onContinuePress: (seletedBNPL: InstallmentMethodsResponse) => {
					handleBNPLSelection(seletedBNPL);
				},
			},
		});
	};

	const handleBNPLSelection = (seletedBNPLItem: InstallmentMethodsResponse) => {
		setSelectedBNPL(seletedBNPLItem);
		setSelectedPaymentType(paymentMethod.bnpl);
		closeSheetModal();
	};

	const renderBNPLOptions = (isSelected: boolean) => {
		if (isSelected && selectedBNPL) {
			return (
				<View className="flex-row mt-2 items-center">
					<GenericImage
						width="w-[44px]"
						height="h-4"
						resizeMode="contain"
						uri={selectedBNPL?.image_url || ''}
					/>
					{selectedBNPL.name !== 'tamam' && (
						<HtmlTextRenderer
							parentClassName={`${fontPrimaryRegular} text-xs text-shades-gray-02 ms-2`}
							html={strings('label.splitInst').replace(
								'{noOfInstallments}',
								selectedBNPL.payment_installment.toString(),
							)}
						/>
					)}

					<View className="flex-row justify-start items-center ms-1">
						<PriceWithCurrencey
							height={14}
							width={12}
							bgColor={Colors[theme].shadesGray02}
							customTextClassName={`${fontPrimaryBold} text-shades-gray-02 text-xs`}
							customDecimalTextClassName="text-xxs"
							price={
								selectedBNPL.name === 'tamam'
									? tamamOffers
										? getMinValueForTamam(tamamOffers)
										: '0.00'
									: selectedBNPL.installment_amount
							}
						/>
						<CustomText
							fontVarient="regular"
							className="text-xs text-shades-gray-01"
						>
							{selectedBNPL.name === 'tamam'
								? strings('label.perMonth')
								: strings('label.perM')}
						</CustomText>
					</View>
					<Pressable className="grow items-start" onPress={onPressBNPL}>
						<CustomText
							fontVarient="medium"
							className="text-xs text-secondary-blue ms-2"
						>
							{strings('button.edit')}
						</CustomText>
					</Pressable>
				</View>
			);
		} else {
			return (
				<View className="flex-row mt-2 gap-2">
					{installmentMethods?.map((item) => {
						const isDisabled = isBNPLOptionDisbaled(
							'DEVICE',
							deviceDetails?.price ?? '0',
							item,
						);
						return (
							<View
								key={item?.name}
								className={`${isDisabled ? 'opacity-50' : 'opacity-100'}`}
							>
								<GenericImage
									width="w-[44px]"
									height="h-4"
									resizeMode="contain"
									uri={item?.image_url}
								/>
							</View>
						);
					})}
				</View>
			);
		}
	};
	const openCouponSheet = () => {
		setActiveSheet('couponListSheet', {
			title: strings('label.applyCoupon'),
			props: {
				currentCouponCode: coupon,
				onApplyCoupon: (coupon: string) => {
					closeSheetModal();
					handleApplyCoupon(coupon);
				},
				onRemoveCoupon: () => {
					closeSheetModal();
					handleDeleteCoupon();
				},
				coupons: coupons,
				slotList: [
					{
						id: '1',
						title: '054 21 1212',
						subtitle: 'Primary number',
					},
					{
						id: '2',
						title: '054 21 1212',
						subtitle: 'Family number',
					},
				],
			},
			snapPoints: ['70%', maxSheetHeight],
			enableDynamicSizing: false,
		});
	};

	const openAutoRenewErrorSheet = () => {
		setActiveSheet('genericActionSheet', {
			snapPoints: ['60%'],
			props: {
				primaryButtonPress: () => {
					closeSheetModal();
				},
				secondaryButtonPress: () => {
					setAutoRenewEnabled(false);
					closeSheetModal();
				},
				image: require('../../../public/images/card-error.webp'),
				title: strings('common.subFailTitle'),
				subTitle: strings('common.subFailSubTitle'),
				primaryButtonText: strings('button.useAnotherCard'),
				secondaryButtonText: strings('button.continueWithoutRenewal'),
				imageHeight: 'h-[100px]',
				parentContainerStyle: 'pt-10',
				secondaryButtonTextClassName: 'text-sm',
			},
		});
	};

	const showApplePay =
		paymentCardsData?.is_auto_renew_enabled_for_apple_pay &&
		userType === 'TELCO' &&
		Platform.OS === 'ios';
	const showGooglePay = userType === 'TELCO' && Platform.OS === 'android';

	const cardLimitReached =
		paymentCardsData?.cards?.filter((card: any) => !card.is_apple_pay)
			?.length === constants.MAX_CARD_ADD_LIMIT;

	const addPaymentMethodSheet = (isForSubscription = false) => {
		if (!showApplePay && !showGooglePay && cardLimitReached) return;
		setActiveSheet('addPaymentMethodSheet', {
			snapPoints: ['85%'],
			title: strings('label.addNewPayMethod'),

			props: {
				onSelectPaymentMethod: (type: string) => {
					handleAddPaymentMethod(type, isForSubscription);
				},
				showApplePay: showApplePay,
			},
		});
	};

	const handleAddPaymentMethod = (type: string, isForSubscription = false) => {
		if (type === 'card') {
			openAddCardSheet(isForSubscription);
		} else if (type === 'applePay') {
			closeSheetModal();
			InteractionManager.runAfterInteractions(() =>
				handleApplePay({ amount: '1.00', mode: 'ADD_CARD' }),
			);
		}
	};

	const openAutoRenewSheet = () => {
		setActiveSheet('autorenewSubscriptionSheet', {
			props: {
				paymentMethod: selectedPaymentType,
				onPrimaryButtonPress: (isPaymentUpdated = false) => {
					//call api
					closeSheetModal();
					setAutoRenewEnabled(true);
					showToast({
						message:
							isPaymentUpdated === true
								? strings('common.autoRenewActivated')
								: strings('common.yourRenewalActivatedSuccessfully'),
						position: 'top',
					});
				},
				onSecondaryButtonPress: () => {
					closeSheetModal();
					// openAutoRenewErrorSheet(); this component will be integrated correctly once the payment api fails due to auto renew error hence commented for now for reference
					setAutoRenewEnabled(false);
				},
				onChangeButtonPress: () => {
					if (selectedPaymentType === constants.paymentMethod.creditDebitCard) {
						setActiveSheet('showCardSheet', {
							snapPoints: ['85%'],
							title: strings('common.changePaymentMethod'),
							onBackPress: closeSheetModal,
							showBack: true,
							props: {
								handleSelectedCard: (card: CardResponse, cvv: string) => {
									handleSelectedCard(card, cvv);
									openAutoRenewSheet();
								},
								handleAddCard: () => {
									addPaymentMethodSheet(true);
								},
								cards: savedCards,
							} as ShowCardSheetProps,
						});
					} else {
						setAutoRenewEnabled(false);
						closeSheetModal();
					}
				},
				selectedCard: selectedCard,
			},
			enableDynamicSizing: false,
			snapPoints: ['80%', maxSheetHeight],
		});
	};

	const onPressAutoRenew = () => {
		if (isAutoRenewEnabled) {
			setAutoRenewEnabled(false);
			return;
		}
		openAutoRenewSheet();
	};

	const handleWalletToggle = (value: boolean) => {
		if (!value) {
			setSelectedPaymentType(paymentMethod.apple);
			return;
		}
		if (
			walletBalanceData?.balance?.balance &&
			walletBalanceData?.balance?.balance > 0
		) {
			setActiveSheet('editWalletSheet', {
				snapPoints: Platform.OS === 'web' ? ['45%'] : ['70%'],
				keyboardBehavior: 'extend',
				enableBlurKeyboardOnGesture: true,
				enableDynamicSizing: true,
				props: {
					balance: walletBalanceData?.balance?.balance,
					onApplySuccess: (amount: number) => {
						closeSheetModal();
						// setSelectedPaymentType(paymentMethod.wallet);
						setWalletAmountToUse(amount);
						setSelectedPaymentType(
							value ? paymentMethod.wallet : paymentMethod.apple,
						);
					},
					onPressAddVoucher: () => {
						setActiveSheet('addVoucherSheet', {
							snapPoints: ['70%'],
							title: strings('label.addVoucher'),
							props: {
								onApplySuccess: () => {
									closeSheetModal();
									setSelectedPaymentType(
										value ? paymentMethod.wallet : paymentMethod.apple,
									);
								},
							},
						});
					},
				},
			});
		} else {
			setActiveSheet('addVoucherSheet', {
				snapPoints: ['70%'],
				title: strings('label.addVoucher'),
				props: {
					onApplySuccess: () => {
						closeSheetModal();
						setSelectedPaymentType(
							value ? paymentMethod.wallet : paymentMethod.apple,
						);
					},
				},
			});
		}
	};

	const isAutoRenewSupported = () => {
		//Auto renew only enabled for renew package and order SIM types and disabled for other plus bnpl, mokafaa payment methods
		if (type === paymentFor.renewPackage || type === paymentFor.orderSIM) {
			switch (selectedPaymentType) {
				case paymentMethod.creditDebitCard:
					return hasSavedCreditCard;
				case paymentMethod.apple:
				case paymentMethod.googlePay:
				case paymentMethod.wallet:
					return true;
				case paymentMethod.bnpl:
				case paymentMethod.mokafaa:
					return false;
				default:
					return false;
			}
		} else {
			return false;
		}
	};

	// console.log("Loader : ", paymentCardLoading ||
	// 				packageCartLoading ||
	// 				orderCartLoading ||
	// 				// isOrderDetailsLoading ||
	// 				isPaymentLoading ||
	// 				isApplyCouponInProgress ||
	// 				isDeleteCouponInProgress ||
	// 				isInstallmentMethodsLoading ||
	// 				tamamOfferLoading ||
	// 				isUpdateSlotLoading ||
	// 				fetchingMultilineExproedPackages ||
	// 				multilineCreateCartInProgress ||
	// 				multilineGroupCartInProgress ||
	// 				multilinePaymentInProgress ||
	// 				isAddApplePayCardPending)
					// console.log("paymentCardLoading : ", paymentCardLoading)
					// console.log("packageCartLoading : ", packageCartLoading)
					// console.log("orderCartLoading : ", orderCartLoading)
					// console.log("isPaymentLoading : ", isPaymentLoading)
					// console.log("isApplyCouponInProgress : ", isApplyCouponInProgress)
					// console.log("isDeleteCouponInProgress : ", isDeleteCouponInProgress)
					// console.log("isInstallmentMethodsLoading : ", isInstallmentMethodsLoading)
					// console.log("tamamOfferLoading : ", tamamOfferLoading)
					// console.log("isUpdateSlotLoading : ", isUpdateSlotLoading)
					// console.log("fetchingMultilineExproedPackages : ", fetchingMultilineExproedPackages)
					// console.log("multilineCreateCartInProgress : ", multilineCreateCartInProgress)
					// console.log("multilineGroupCartInProgress : ", multilineGroupCartInProgress)
					// console.log("multilinePaymentInProgress : ", multilinePaymentInProgress)
					// console.log("isAddApplePayCardPending : ", isAddApplePayCardPending)

	const renderPaymentLink = () => {
		const paymentLink = routePaymentLink || packageCartData?.paymentLink;

		if (!paymentLink) return null;

		const isMobileWindow = windowWidth < 768;

		return (
			<View style={{ flex: 1, width: isMobileWindow ? windowWidth : undefined }}>
				{Platform.OS === 'web' ? (
					<iframe
						src={paymentLink}
						title="Payment"
						style={{ width: isMobileWindow ? windowWidth : '100%', height: '100%', border: 'none' }}
						frameBorder="0"
					/>
				) : (
					<WebView
						source={{ uri: paymentLink }}
						startInLoadingState
						javaScriptEnabled
						domStorageEnabled
						originWhitelist={['*']}
					/>
				)}
			</View>
		);
	};

	if (!routePaymentLink && (packageCartLoading || isPackageCartMutating > 0)) {
		return <Loader loading />;
	}

	if (routePaymentLink || (packageCartData?.paymentRedirect && packageCartData?.paymentLink)) {
		return renderPaymentLink();
	}

	return (
		<>
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View
					className={`flex-1 p-5 ${type === paymentFor.orderSIM && journeyName ? 'pt-0' : 'pt-5'}`}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerClassName="gap-6 pb-[150px]"
					>
						<CustomText
							className={`${fontPrimaryBold} text-lg text-secondary-gray ${Platform.OS === 'web' ? 'text-start' : 'text-left'}`}
						>
							{strings('label.payment')}
						</CustomText>
                        {/* Commented since order eSim is only the part of scope might remove later to support order device */}
						{/* {[paymentFor.orderDevice, paymentFor.addApps].includes(
							type as string,
						) ? (
							<DeviceCheckoutCard
								imageUrl={checkOutCardInfo?.imageUrl ?? ''}
								price={checkOutCardInfo?.price ?? ''}
								title={checkOutCardInfo?.name}
								specifications={checkOutCardInfo?.options ?? {}}
							/>
						) : ( */}
							<DataPackageCard
								couponCode="RENEW123"
								isCouponApplied
								price={renewPackage?.price_tax}
								infoContent={[
									{
										text:
											renewPackage?.package_for === 'esim'
												? strings('common.eSim')
												: strings('common.sim'),
										weight: 'bold',
									},
									{ text: 'Card' },
								]}
								phoneNumber={requestedMsisdn || ''}
								mainContainerClass="!bg-secondary-white"
								packageImage={renewPackage?.package_logo_image}
								packageType={`${isDataPackage(renewPackage) ? 'Data' : 'Voice'} ${strings('label.package')}`}
								infoPillClassName="!bg-shades-purple-06 !items-center"
							/>
						{/* )} */}
						{type === paymentFor.orderDevice &&
						orderCartData?.deliveryDetails?.address ? (
							<DeliveryAddressCard
								title={name || ''}
								description={orderCartData?.deliveryDetails?.address ?? ''}
								editable={false}
								renderFooter={
									<DeliveryAddressFooter orderCartData={orderCartData} />
								}
							/>
						) : null}

						<View className="bg-secondary-white rounded-xl py-4">
							<CustomText
								className={`${fontPrimaryBold} text-base text-secondary-gray mx-4 text-left`}
							>
								{strings('label.redemptionOptions')}
							</CustomText>
							<View className="px-1 mt-2">
								<>
									<SectionItem
										key={strings('label.useWalletBalance')}
										leading={
											<View className="p-2 rounded-[8px] bg-shades-purple-06 self-start">
												<GenericImage
													height="28"
													width="28"
													className="h-7 w-7"
													resizeMode="contain"
													uri={require('../../../public/images/wallet-payment-logo.webp')}
												/>
											</View>
										}
										label={strings('label.useWalletBalance')}
										trailingSwitch
										onTrailingSwitchPress={(value) => {
											value && handleWalletToggle(value);
										}}
										onPress={() => handleWalletToggle(selectedPaymentType !== paymentMethod.wallet)}
										isSwitchOn={selectedPaymentType === paymentMethod.wallet}
										controlledCommit={true}
										containerClassName="bg-secondary-white p-3"
										labelClassName={`!text-sm ${fontPrimaryMedium} ${Platform.OS === 'web' && isRTL() ? '!text-end' : '!text-left'} !text-secondary-gray`}
										bodyComponent={
											<View className="flex-column">
												{/* use this bool for cases where wallet is linked or not (true for linked and false for not) */}
												{walletBalanceData?.balance?.balance &&
												walletBalanceData?.balance?.balance > 0 ? (
													<>
														{/* Available balance row */}
														<View className="flex-row items-center gap-1 mt-1">
															<CustomText
																fontVarient="regular"
																className={`text-xs text-shades-gray-02 ${
																	Platform.OS === 'web' && isRTL()
																		? '!text-end'
																		: '!text-left'
																}`}
															>
																{`${strings('label.availableBalance')} :`}
															</CustomText>

															<PriceWithCurrencey
																height={11}
																width={10}
																price={
																	selectedPaymentType === paymentMethod.wallet
																		? walletBalanceData?.balance?.balance -
																			walletAmountToUse
																		: walletBalanceData?.balance?.balance
																}
																customTextClassName="text-xs text-secondary-gray"
															/>

															{selectedPaymentType === paymentMethod.wallet && (
																<PriceWithCurrencey
																	height={7}
																	width={6}
																	price={walletBalanceData?.balance?.balance}
																	showStrikeThroughLine
																	strikeLineColor="bg-shades-gray-04"
																	customTextClassName="text-xxs text-shades-gray-04"
																/>
															)}
														</View>

														{/* Actions */}
														<View className="self-start mt-3">
															<View className="flex-row self-start bg-shades-blue-06 items-center rounded-md overflow-hidden">
																<Pressable className="px-[15px] py-1">
																	<CustomText
																		fontVarient="medium"
																		className="text-secondary-blue text-xs"
																	>
																		{strings('button.editBalance')}
																	</CustomText>
																</Pressable>

																<View className="w-[1px] h-[80%] bg-secondary-white" />

																<Pressable className="px-[15px] py-1">
																	<CustomText
																		fontVarient="medium"
																		className="text-secondary-blue text-xs"
																	>
																		{strings('button.addVoucher')}
																	</CustomText>
																</Pressable>
															</View>
														</View>
													</>
												) : (
													<View className="flex-row items-center gap-1 mt-1">
														<CustomText
															fontVarient="regular"
															className={`text-xs text-shades-gray-02 ${
																Platform.OS === 'web' && isRTL()
																	? '!text-end'
																	: '!text-left'
															}`}
														>
															{`${strings('label.havingVoucher')},`}
														</CustomText>
														<Pressable
															className="flex-row self-end mt-[3px]"
															onPress={() => handleWalletToggle(selectedPaymentType !== paymentMethod.wallet)}
														>
															<CustomText
																fontVarient="regular"
																className={`text-xs text-secondary-blue ${
																	Platform.OS === 'web' && isRTL()
																		? '!text-end'
																		: '!text-left'
																}`}
															>
																{strings('button.add&Redeem')}
															</CustomText>
															<GenericImage
																height="18"
																width="18"
																className="w-[18px] h-[18px]"
																resizeMode="contain"
																uri={require('../../../public/images/arrow-right.webp')}
															/>
														</Pressable>
													</View>
												)}
											</View>
										}
									/>
									{paymentCardsData?.is_mokafaa_pay_enabled && (
										<>
											<Divider containerClassName="mt-1" />
											<SectionItem
												key={strings('action.mokafaaPoints')}
												leading={
													<View className="p-2 rounded-[8px] bg-shades-purple-06 self-start">
														<GenericImage
															height="28"
															width="28"
															className="h-7 w-7"
															resizeMode="contain"
															uri={require('../../../public/images/mokafaa.webp')}
														/>
													</View>
												}
												label={strings('action.mokafaaPoints')}
												trailingSwitch
												onTrailingSwitchPress={(value) => {
													// handleToggle(value, item);
													onPressMokafaa(value);
												}}
												isSwitchOn={
													selectedPaymentType === paymentMethod.mokafaa
												}
												controlledCommit={true}
												containerClassName="bg-secondary-white p-3"
												labelClassName={`!text-sm ${fontPrimaryMedium} ${Platform.OS === 'web' && isRTL() ? '!text-end' : '!text-left'} !text-secondary-gray`}
												bodyComponent={
													<View>
														{/* use this bool for cases where mokafaa is linked or not (true for linked and false for not) */}
														{false ? (
															<View className="flex-row items-center gap-1 mt-1">
																<CustomText
																	fontVarient="regular"
																	className={`text-xs text-shades-gray-02 ${Platform.OS === 'web' && isRTL() ? '!text-end' : '!text-left'}`}
																>
																	{strings('label.addPointsToRedeem')}
																</CustomText>
																<PriceWithCurrencey
																	height={11}
																	width={10}
																	price={20}
																	customTextClassName="text-xs text-secondary-gray"
																/>
															</View>
														) : (
															<View className="flex-row items-center gap-1 mt-1">
																<CustomText
																	fontVarient="regular"
																	className={`text-xs text-shades-gray-02 ${
																		Platform.OS === 'web' && isRTL()
																			? '!text-end'
																			: '!text-left'
																	}`}
																>
																	{`${strings('label.usePoints')},`}
																</CustomText>
																<Pressable className="flex-row self-end mt-[3px]">
																	<CustomText
																		fontVarient="regular"
																		className={`text-xs text-secondary-blue ${
																			Platform.OS === 'web' && isRTL()
																				? '!text-end'
																				: '!text-left'
																		}`}
																	>
																		{strings('button.linkAccountNow')}
																	</CustomText>
																	<GenericImage
																		height="18"
																		width="18"
																		className="w-[18px] h-[18px]"
																		resizeMode="contain"
																		uri={require('../../../public/images/arrow-right.webp')}
																	/>
																</Pressable>
															</View>
														)}
													</View>
												}
											/>
										</>
									)}
									{/* <RadioButton
                                            label={strings('action.mokafaaPoints')}
                                            containerClassName="bg-secondary-white p-3"
                                            leadingIcon={require('../../../public/images/mokafaa.webp')}
                                            onPress={onPressMokafaa}
                                            selected={selectedPaymentType === paymentMethod.mokafaa}
                                            labelClassName={fontPrimaryMedium}
                                            subHeadingComponent={
                                                selectedPaymentType === paymentMethod.mokafaa ? (
                                                    <View className="flex-row items-center gap-1 mt-2">
                                                        <CustomText
                                                            fontVarient="regular"
                                                            className="text-xs text-shades-gray-02"
                                                        >
                                                            {strings('label.using')}
                                                        </CustomText>
                                                        <PriceWithCurrencey
                                                            height={11}
                                                            width={10}
                                                            price={getTotalAmount()}
                                                            customTextClassName="text-xs"
                                                            customDecimalTextClassName="text-xxs"
                                                        />
                                                        <CustomText
                                                            fontVarient="regular"
                                                            className="text-xs text-shades-gray-02"
                                                        >
                                                            {strings('label.fromMokafaaPoints')}
                                                        </CustomText>
                                                    </View>
                                                ) : null
                                            }
                                        /> */}
								</>
							</View>
						</View>
						{/* Other eligible package for renewal */}
						{isMultiLineRenewal && otherRenewPackages.length > 0 && (
							<Section
								collapsed
								isCollapsible
								isCustomLabel
								containerClassName="!bg-secondary-blue px-0.5 py-0.5"
								collapseIconProps={{
									stroke: Colors[theme].secondaryWhite,
								}}
								collapseIconViewClassName="me-3"
								customLabel={
									<View className="flex-row gap-3 items-center px-3 py-3">
										<View className="w-10 h-10 rounded-xl bg-secondary-white py-1 px-2 justify-center items-center">
											<GenericImage
												height="32"
												width="32"
												className="h-8 w-8"
												uri={require('../../../public/images/renew-numbers.webp')}
											/>
										</View>
										<View>
											<CustomText
												fontVarient="bold"
												className="text-sm text-secondary-white"
											>
												{strings('common.numExpsoon').replace(
													'{placeholder}',
													otherRenewPackages?.length?.toString() || '',
												)}
											</CustomText>
											<View className="flex-row">
												<CustomText
													fontVarient="regular"
													className="text-xs text-secondary-smoke"
												>
													{strings('common.renewNowToEnjoy')}
												</CustomText>
											</View>
										</View>
									</View>
								}
							>
								<View className="flex-1 gap-3 bg-secondary-white py-3 px-3 rounded-xl">
									{otherRenewPackages?.map((item) => {
										const packageDetail = item.incentivePackageDetails;
										return (
											<DataPackageCard
												couponCode="AUTORENEW10"
												// isCouponApplied
												key={packageDetail.sku}
												price={packageDetail.price}
												infoContent={[
													{
														text:
															item.simType === SIM_TYPE.ESIM
																? strings('common.sim')
																: strings('common.eSim'),
														weight: 'bold',
													},
													{ text: 'Card' },
												]}
												phoneNumber={item.msisdn}
												mainContainerClass="!bg-secondary-white border !border-shades-gray-06 rounded-lg"
												packageImage={packageDetail?.package_logo_image}
												packageType={`${isDataPackage(packageDetail) ? 'Data' : 'Voice'} ${strings('label.package')}`}
												infoPillClassName="!bg-shades-purple-06 !items-center"
												// bottomView={
												// 	<ExpiryInfo
												// 		expiryDate={packageDetail.created_at}
												// 		daysLeft={packageDetail.created_at?.toString()}
												// 	/>
												// }
												trailing={
													<CustomCheckbox
														// isChecked={selectedSkus.includes(packageDetail.sku)}
														isChecked={selectedSkus.some(
															(selected) => selected.lineId === item.lineId,
														)}
														onToggle={() => {
															toggleSku(packageDetail.sku, item.lineId);
														}}
														className="ms-8 !py-0"
													/>
												}
											/>
										);
									})}
								</View>
							</Section>
						)}

						<View className="bg-secondary-white rounded-xl py-4">
							<CustomText
								className={`${fontPrimaryBold} text-base text-secondary-gray mx-4 text-left`}
							>
								{strings('label.paymentMethod')}
							</CustomText>
							<View className="px-1 mt-2">
								{paymentCardsData?.is_apple_pay_enabled &&
									showApplePayButton && (
										<>
											<RadioButton
												label={strings('action.applePay')}
												onPress={() =>
													setSelectedPaymentType(paymentMethod.apple)
												}
												selected={selectedPaymentType === paymentMethod.apple}
												containerClassName="bg-secondary-white p-3"
												leadingIcon="applePay"
												leadingIconWidth={65}
												leadingIconHeight={25}
												leadingIconViewBox={'0 0 165.521 105.965'}
												labelClassName={fontPrimaryMedium}
												leadingIconViewClassName={'!bg-transparent'}
											/>
											<Divider containerClassName="mb-1" />
										</>
									)}
								<RadioButton
									label={strings('action.googlePay')}
									onPress={() =>
										setSelectedPaymentType(paymentMethod.googlePay)
									}
									selected={selectedPaymentType === paymentMethod.googlePay}
									containerClassName="bg-secondary-white p-3"
									leadingIcon={require('../../../public/images/googlePay.webp')}
									// leadingIconWidth={65}
									// leadingIconHeight={25}
									leadingIconHeight={26}
									leadingIconWidth={64}
									labelClassName={fontPrimaryMedium}
									leadingIconViewClassName={'!bg-transparent'}
								/>
								<Divider containerClassName="mb-1" />
								<RadioButton
									label={strings('action.creditDebitCard')}
									containerClassName="bg-secondary-white p-3"
									leadingIcon="card"
									onPress={handleCardPayment}
									selected={
										selectedPaymentType === paymentMethod.creditDebitCard
									}
									labelClassName={fontPrimaryMedium}
									subHeadingComponent={
										!hasSavedCreditCard ? (
											<AcceptedCards containerClassName="mt-2" />
										) : (
											<CreditCardView
												card={selectedCard}
												openShowCardSheet={openShowCardSheet}
											/>
										)
									}
									presseableClassName={`${hasSavedCreditCard ? '!items-start' : '!items-center'}`}
								/>
								{type === paymentFor.orderDevice && (
									<>
										<Divider containerClassName="mb-1" />
										<RadioButton
											label={strings('action.buyNowPayLater')}
											containerClassName="bg-secondary-white p-3"
											leadingIcon={require('../../../public/images/bnpl.webp')}
											onPress={onPressBNPL}
											selected={selectedPaymentType === paymentMethod.bnpl}
											labelClassName={fontPrimaryMedium}
											subHeadingComponent={renderBNPLOptions(
												selectedPaymentType === paymentMethod.bnpl,
											)}
										/>
									</>
								)}
								{/* Kept commented for reference, will remove after testing
								{paymentCardsData?.is_mokafaa_pay_enabled && (
									<>
										<Divider containerClassName="mt-1" />
										<RadioButton
											label={strings('action.mokafaaPoints')}
											containerClassName="bg-secondary-white p-3"
											leadingIcon={require('../../../public/images/mokafaa.webp')}
											onPress={onPressMokafaa}
											selected={selectedPaymentType === paymentMethod.mokafaa}
											labelClassName={fontPrimaryMedium}
											subHeadingComponent={
												selectedPaymentType === paymentMethod.mokafaa ? (
													<View className="flex-row items-center gap-1 mt-2">
														<CustomText
															fontVarient="regular"
															className="text-xs text-shades-gray-02"
														>
															{strings('label.using')}
														</CustomText>
														<PriceWithCurrencey
															height={11}
															width={10}
															price={getTotalAmount()}
															customTextClassName="text-xs"
															customDecimalTextClassName="text-xxs"
														/>
														<CustomText
															fontVarient="regular"
															className="text-xs text-shades-gray-02"
														>
															{strings('label.fromMokafaaPoints')}
														</CustomText>
													</View>
												) : null
											}
										/>
									</>
								)} */}
							</View>
							<Svg height="2" width="100%">
								<Line
									x1="0"
									y1="1"
									x2="100%"
									y2="1"
									stroke={Colors[theme].shadesGray06}
									strokeWidth="1"
									strokeDasharray="5, 5" // Dot length, Gap length
								/>
							</Svg>
							<SectionItem
								leadingIcon={'quickPay'}
								iconWidth={20}
								label={strings('action.shareQuickPay')}
								containerClassName="!py-0 ml-6 mt-4 !gap-2"
								iconHeight={21}
								iconViewBox="0 0 20 21"
								labelClassName={`${fontPrimaryMedium} !text-sm !text-secondary-blue`}
								showFallabackArrow={false}
								onPress={onShare}
							/>
						</View>

						<AutoRenewCard
							isDisabled={!isAutoRenewSupported()}
							autoRenewEnabled={isAutoRenewEnabled}
							onAutoRenewPress={onPressAutoRenew}
						/>

						<View className="bg-secondary-white rounded-xl">
							{hasCouponApllied ? (
								<>
									{isMultiLineRenewal ? (
										<Section
											collapsed
											isCollapsible
											isCustomLabel
											customLabel={
												<View className="flex-row gap-3 items-center">
													<SVGIcon
														name={'verified'}
														width={36}
														viewBox="0 0 18 12"
													/>
													<View className="gap-1 -ms-2">
														<CustomText
															fontVarient="bold"
															className="text-sm text-secondary-gray"
														>
															{multiLineCoupons?.length}{' '}
															{strings('common.couponsApplied')}
														</CustomText>
														<View className="flex-row">
															<CustomText
																fontVarient="regular"
																className="text-xs text-secondary-green"
															>
																{strings('common.totalsaving')}{' '}
															</CustomText>
															<PriceWithCurrencey
																bgColor={Colors[theme].secondaryGreen}
																height={11}
																width={10}
																price={32}
																customTextClassName={`text-xs text-secondary-green -ms-[1.5px] me-0.5 ${fontPrimaryMedium} text-left text-start`}
															/>
														</View>
													</View>
												</View>
											}
										>
											<View className="py-4 gap-4">
												{multiLineCoupons.map((c) => {
													return (
														<CouponCard
															key={c.couponCode}
															containerClassName="border border-shades-purple-06"
															onPressChange={openCouponSheet}
															couponCode={c.couponCode}
															applied
															couponDescription={c.couponDescription}
															showCheckIcon={false}
															appliedOnText={c.appliedOnText}
														/>
													);
												})}
											</View>
											<CouponFooter
												openCouponSheet={openCouponSheet}
												separatorClassName="!px-0"
												buttonClassName="!px-0 !pb-0"
											/>
										</Section>
									) : (
										<>
											<CouponCard
												onPressChange={openCouponSheet}
												couponCode="RENEW15OFF"
												applied
												couponDescription="Save 12 & 10GB on this"
												showCheckIcon={true}
											/>
											<CouponFooter openCouponSheet={openCouponSheet} />
										</>
									)}
								</>
							) : (
								<Pressable
									onPress={openCouponSheet}
									className="flex-row justify-between bg-secondary-white p-4 rounded-xl"
								>
									<View className="flex-row gap-2">
										<SVGIcon name="coupon" />
										<CustomText
											fontVarient="bold"
											className="text-base text-secondary-gray"
										>
											{strings('common.ViewAllCoupons')}
										</CustomText>
									</View>
									<View className={`${isRTL() ? 'rotate-180' : ''}`}>
										<SVGIcon name="arrow" />
									</View>
								</Pressable>
							)}
						</View>

						<View className="gap-2 bg-secondary-white rounded-xl p-4">
							<CustomText
								className={`${fontPrimaryBold} text-base text-secondary-gray text-left`}
							>
								{strings('label.transactionDetails')}
							</CustomText>
							{selectedPackages?.map((item, index) => {
								// const name = isMultilineLogin
								// 	? item?.name?.concat(` ${strings('label.package')}`)
								// 	: item?.name;
								return (
									<TransactionDetailItem
										key={item.sku}
										leadingLabel={item?.name}
										price={item.price ?? 0}
										containerClassName={`${index === 0 ? 'mt-1' : ''}`}
									/>
								);
							})}
							{/* <TransactionDetailItem
								leadingLabel={`VAT ${selectedPackages?.[0]?.product_tax_percentage ?? 0}`}
								price={selectedPackages?.[0]?.product_tax_amount ?? 0}
							/> */}
							<TransactionDetailItem
								leadingLabel={getVatLabel()}
								price={getVatAmout()}
							/>
							{getDiscountAmount() !== 0 && (
								<TransactionDetailItem
									leadingLabel={'Discount'}
									price={Math.abs(getDiscountAmount())}
									showCurrenyInNegative
								/>
							)}
							{selectedPaymentType === paymentMethod.mokafaa && (
								<TransactionDetailItem
									leadingLabel={strings('action.mokafaaPoints')}
									price={getTotalAmount()}
									showCurrenyInNegative
								/>
							)}
							{/* <TransactionDetailItem
								discount={0}
								leadingLabel={strings('label.deliveryCharges')}
								price={selectedPackages?.[0]?.deliveryCharges}
							/> */}
							<View className="bg-shades-gray-06 h-[1px] w-full my-1" />
							<TransactionDetailItem
								leadingLabel={strings('label.totalPrice')}
								// price={selectedPackages?.reduce(
								// 	(total, item) => total + (item.price_tax ?? 0),
								// 	0,
								// )}
								price={
									selectedPaymentType === paymentMethod.mokafaa
										? 0.0
										: getTotalAmount()
								}
								leadingLabelClassName="!text-base !text-secondary-gray"
								trailinglabelFont={fontPrimaryBold}
								trailingLabelClassName="!text-base !text-secondary-green"
								currencyIconWidth={14}
								currencyIconHeight={16}
								currencyColor={Colors[theme].secondaryGreen}
								showFree={selectedPaymentType !== paymentMethod.mokafaa}
							/>
						</View>
					</ScrollView>
				</View>
				<CustomFooter className="pb-safe">
					{paymentFor.orderDevice === type && (
						<View className="flex-row gap-2 justify-center items-center">
							<CustomCheckbox
								isChecked={tandcChecked}
								onToggle={() => markTCChecked(!tandcChecked)}
							/>

							<CustomText
								className={`text-center text-sm text-shades-gray-02 ${fontPrimaryRegular}`}
							>
								{`${strings('label.byProceeding')} `}
								{/* <CustomText out of scope
									className={`${fontPrimaryMedium} text-secondary-blue`}
									onPress={handleTermsAndConditions}
									//href={`https://yaqoot.sa/${getCurrentLocale()}/terms`}
								>
									{strings('action.termsConditions')}
								</CustomText> */}
							</CustomText>
						</View>
					)}
					<CustomButton
						disabled={paymentFor.orderDevice === type && !tandcChecked}
						containerClassName="mt-3"
						label={paymentLabel()}
						onPress={handleContinue}
					/>
				</CustomFooter>
			</KeyboardAvoidingView>
			<Loader
				loading={
					paymentCardLoading ||
					isPaymentInitializing ||
					// isOrderDetailsLoading ||
					isPaymentLoading ||
					isApplyCouponInProgress ||
					isDeleteCouponInProgress ||
					isInstallmentMethodsLoading ||
					tamamOfferLoading ||
					isUpdateSlotLoading ||
					fetchingMultilineExproedPackages ||
					multilineCreateCartInProgress ||
					multilineGroupCartInProgress ||
					multilinePaymentInProgress ||
					isAddApplePayCardPending
				}
			/>
		</>
	);
};

export default Payment;

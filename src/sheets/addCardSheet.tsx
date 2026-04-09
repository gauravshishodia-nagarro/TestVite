import qs from 'qs';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { UAT_BASE_URL } from '../apis/axiosInstance';
import { useAddCardMutation } from '../apis/services/payment';
import { CardResponse } from '../apis/types/payment';
import CustomButton from '../components/customButton';
import CustomCheckbox from '../components/customCheckbox';
import CustomInput from '../components/customInput';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import GenericImage from '../components/image';
import Loader from '../components/loader';
import constants from '../configs/constants';
import { endpoints } from '../configs/endpoints';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useThreeDSecurePaymentStore } from '../stores/useThreeDSecurePaymentStore';
import { setAccessibilityProps } from '../types';
import { replaceWithDigits, isRTL } from '../utils/formatter';
import { useAppTranslation } from '../hooks/useAppTranslation';
import {
	CURRENCY,
	LANG,
	TOKENIZATION,
	createSignature,
	getCredentials,
} from '../utils/payfort';
import { closeSheetModal } from '../utils/util';
import {
	validateCard,
	validateCvv,
	validateExpiry,
	validateName,
} from '../utils/validate';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export type AddCardSheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	continueLabel?: string;
	secondaryLabel?: string;
	onPressSecondary?: () => void;
	handlePostMessages: (event: WebViewMessageEvent) => void;
	onNavigationStateChange: (event: WebViewNavigation) => void;
};

type CardFormData = {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	name: string;
	isDefault: boolean;
	cardType: string;
};

type CardFormErrors = {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	name: string;
};

const AddCardSheet: React.FC = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
	const { t: strings } = useAppTranslation();
	const navigation = useNavigation<NavigationProp<any>>();
	const {
		nativeID = 'add_card',
		accessibilityLabel,
		handlePostMessages,
		onNavigationStateChange,
		continueLabel = strings('button.saveAndContinue'),
		secondaryLabel,
		onPressSecondary,
	}: AddCardSheetProps = bottomSheetOptions.props;
	const { setWebViewSource, setCallback } = useThreeDSecurePaymentStore();
	const { fontPrimaryRegular } = constants;
	const [form, setForm] = useState<CardFormData>({
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		name: '',
		isDefault: true,
		cardType: '',
	});

	const { isPending: isAddCardLoading, mutateAsync: addCardMutation } =
		useAddCardMutation();

	const [errors, setErrors] = useState<CardFormErrors>({
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		name: '',
	});
	const update = (field: keyof CardFormData, value: string) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const updateError = (field: keyof CardFormErrors, value: string) =>
		setErrors((prev) => ({ ...prev, [field]: value }));

	const _validateCvv = (_value: string) => {
		const value = replaceWithDigits(_value);

		update('cvv', value);
		updateError('cvv', '');

		if (!validateCvv(value)) {
			updateError('cvv', strings('error.cardCvvError'));
		}
	};
	const _validateName = (value: string) => {
		update('name', value);
		updateError('name', '');

		if (!validateName(value)) {
			updateError('name', strings('error.cardholderNameError'));
		}
	};
	const _validateCardNumber = (_value: string) => {
		const value = replaceWithDigits(_value);
		update('cardNumber', value);
		updateError('cardNumber', '');

		const { card_type, validity } = validateCard(value);

		update('cardType', card_type);

		if (!validity) {
			updateError('cardNumber', strings('error.cardNumberError'));
		}
	};

	const formatExpiry = (text: string) => {
		let cleaned = text.replace(/\D/g, '');
		if (cleaned.length >= 3) {
			cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
		}
		update('expiryDate', cleaned);
	};

	const _validateExpiry = (value: string) => {
		formatExpiry(value);

		updateError('expiryDate', '');
		if (!validateExpiry(value)) {
			updateError('expiryDate', strings('error.cardExpiryError'));
		}
	};

	const isValid = () => {
		return (
			form.cardNumber.length > 0 &&
			errors.cardNumber.length === 0 &&
			form.cvv.length > 0 &&
			errors.cvv.length === 0 &&
			form.name.length > 0 &&
			errors.name.length === 0 &&
			form.expiryDate.length > 0 &&
			errors.expiryDate.length === 0
		);
	};

	const cardIcon = (type: string) => {
		let icon = '';
		switch (type.toLowerCase()) {
			case 'visa':
				icon = require('../../public/images/visa.webp');
				break;
			case 'mada':
				icon = require('../../public/images/ic_mada.png');
				break;
			case 'amex':
				icon = require('../../public/images/ic_amex.png');
				break;
			case 'mastercard':
				icon = require('../../public/images/payment_option_mastercard.png');
				break;
			default:
		}
		return icon;
	};

	const getPayfortBodyRequest = async (response: CardResponse) => {
		const credentials = getCredentials();
		const returnURL = `${UAT_BASE_URL}${endpoints.payfort.addCardReturn}`;
		const signature = await createSignature(credentials.PAYFORT_SHA_REQUEST, {
			service_command: TOKENIZATION,
			access_code: credentials.PAYFORT_ACCESS_CODE,
			merchant_identifier: credentials.PAYFORT_MERCHANT_IDENTIFIER,
			merchant_reference: response?.merchent_referance_tokenization,
			language: LANG,
			return_url: returnURL,
			currency: CURRENCY,
		});
		const data = {
			service_command: TOKENIZATION,
			access_code: credentials.PAYFORT_ACCESS_CODE,
			merchant_identifier: credentials.PAYFORT_MERCHANT_IDENTIFIER,
			language: LANG,
			currency: CURRENCY,

			merchant_reference: response.merchent_referance_tokenization,
			card_number: form.cardNumber,
			expiry_date: form.expiryDate.split('/').reverse().join(''), //'3901', // year + month // need to pick it from the form
			card_security_code: form.cvv,
			return_url: returnURL,
			card_holder_name: form.name, // need to add validation like the old app onChangeText,
			signature: signature,
		};
		console.log('Signature', signature);
		console.log('data', data);

		if (Platform.OS === 'web') {
			return data;
		}
		return qs.stringify(data);
	};

	const navigateTo3DSecureView = async (response: CardResponse) => {
		const body = await getPayfortBodyRequest(response);
		// if (Platform.OS === 'web') {
		// 	// this block is added so that it will not open in a new tab
		// 	// const iframe = document.createElement('iframe');
		// 	// iframe.name = 'payfort_iframe';
		// 	// iframe.style.display = 'none';
		// 	// document.body.appendChild(iframe);
		// 	// iframeRef.current = iframe;

		// 	const form = document.createElement('form');
		// 	form.method = 'post';
		// 	form.action = endpoints.payfort.tokenizationDev;
		// 	form.target = 'frame';
		// 	// form.target = 'payfort_iframe';
		// 	for (const [key, value] of Object.entries(body)) {
		// 		const hiddenField = document.createElement('input');
		// 		hiddenField.type = 'hidden';
		// 		hiddenField.name = key;
		// 		hiddenField.value = value;
		// 		form.appendChild(hiddenField);
		// 	}
		// 	document.body.appendChild(form);
		// 	form.submit();
		// 	document.body.removeChild(form);
		// 	return;
		// }

		const webViewSource = {
			method: 'POST',
			uri: endpoints.payfort.tokenizationDev,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			body,
		};
		setWebViewSource(webViewSource);
		setCallback('onMessage', handlePostMessages);
		setCallback('onNavigationStateChange', onNavigationStateChange);

		setTimeout(() => {
			navigation.navigate('threeDSecureView');
		}, 500);
	};

	const handleAddCard = () => {
		addCardMutation({
			cardHolderName: form.name,
			is_default_card: form.isDefault,
		}).then((response) => {
			closeSheetModal();
			navigateTo3DSecureView(response);
		});
		// .catch((e) => {
		// 	alert(e?.message);
		// });
	};

	return (
		<>
			<KeyboardAwareScrollView className="flex-1">
				<View
					className="bg-shades-purple-06 pt-4 pb-8 px-5 gap-6"
					{...setAccessibilityProps({ nativeID, accessibilityLabel })}
				>
					{/* <Pressable
						className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity}`}
						onPress={() => {
							Platform.OS === 'web'
								? setWebModalVisible(false)
								: setActiveSheet(null);
						}}
					>
						<View className={`${isRTL() ? 'rotate-180' : ''}`}>
							<SVGIcon
								name={'back'}
								width={24}
								height={24}
								stroke={Colors[theme].black}
							/>
						</View>
					</Pressable>

					<CustomText
						className={`pb-1 text-secondary-gray text-xl text-left text-start ${fontPrimaryBold}`}
					>
						{strings('label.addNewCard')}
					</CustomText> */}
					<View className="px-4 py-6 bg-secondary-white rounded-xl gap-6">
						<CustomInput
							containerClassName={
								'!w-[92%] self-start'
							}
							value={form.cardNumber}
							error={errors.cardNumber}
							label={strings('label.cardNumber')}
							placeholder="4242 4242 4242 4242"
							shouldValidate={form.cardNumber.length > 0}
							inputClassName={`${isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
							shouldFocus={false}
							labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
							hideInlineView={errors.cardNumber?.length === 0}
							keyboardType="numeric"
							onChangeText={_validateCardNumber}
							maxLength={16}
							successView={
								form.cardType ? (
									<GenericImage
										uri={cardIcon(form.cardType)}
										width="w-[37px]"
										height="h-[24px]"
										resizeMode="contain"
									/>
								) : undefined
							}
							trailingView={
								<Pressable>
									<GenericImage
										uri={require('../../public/images/camera.webp')}
										height="h-[24px]"
										width="w-[24px]"
										className={`${(isRTL() ? 'right-16' : '-right-14')}`}
									/>
								</Pressable>
							}
						/>
						<View className="flex-row gap-4">
							<View className="flex-1">
								<CustomInput
									value={form.expiryDate}
									error={errors.expiryDate}
									label={strings('label.expiryDate')}
									placeholder="01/39"
									shouldValidate={form.expiryDate.length > 0}
									inputClassName={`${isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
									shouldFocus={false}
									labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
									hideInlineView={errors.expiryDate?.length === 0}
									keyboardType="numeric"
									onChangeText={_validateExpiry}
								/>
							</View>
							<View className="flex-1">
								<CustomInput
									value={form.cvv}
									error={errors.cvv}
									label={strings('label.cvv')}
									placeholder="***"
									shouldValidate={form.cvv.length > 0}
									inputClassName={`${isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
									shouldFocus={false}
									labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
									hideInlineView={errors.cvv?.length === 0}
									keyboardType="numeric"
									secureTextEntry
									onChangeText={_validateCvv}
									maxLength={4}
								/>
							</View>
						</View>
						<CustomInput
							value={form.name}
							error={errors.name}
							label={strings('label.nameOnCard')}
							placeholder={strings('placeholder.enterName')}
							onChangeText={_validateName}
							shouldValidate={form.name.length > 0}
							inputClassName={`${isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
							shouldFocus={false}
							labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
							hideInlineView={errors.name?.length === 0}
						/>
						<Divider containerClassName="!bg-shades-gray-06" />
						<CustomCheckbox
							className="!py-0"
							isChecked={form.isDefault}
							onToggle={() => setForm({ ...form, isDefault: !form.isDefault })}
							trailingView={
								<CustomText
									className={`text-sm text-shades-gray-01 px-2 ${fontPrimaryRegular}`}
								>
									{strings('label.setCardDefault')}
								</CustomText>
							}
						/>
					</View>
					<CustomButton
						label={continueLabel}
						onPress={handleAddCard}
						filledBorderColor={
							isValid() ? 'border-secondary-gray' : 'border-shades-gray-04'
						}
						disabled={!isValid()}
						containerClassName="mt-3"
					/>
					{secondaryLabel && (
						<CustomButton
							label={secondaryLabel}
							onPress={onPressSecondary || closeSheetModal}
							type="outlined"
							// containerClassName="mt-3"
						/>
					)}
				</View>
			</KeyboardAwareScrollView>
			<Loader loading={isAddCardLoading} />
		</>
	);
};

export default AddCardSheet;

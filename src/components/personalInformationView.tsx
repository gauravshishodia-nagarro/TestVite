import {
	BottomSheetFooter,
	BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import {
	Keyboard,
	Platform,
	Pressable,
	View,
	useWindowDimensions,
} from 'react-native';
import { useTelcoEmails } from '../apis/services/authentication';
import { useOperatorDictionaryQuery } from '../apis/services/netcracker';
import { useCountryList } from '../apis/services/telcoProvision';
import { OperatorsType } from '../apis/types/netcracker';
import { CountryItem } from '../apis/types/telcoProvision';
import { EmailItem } from '../apis/types/user';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { SelectNationalitySheetProps } from '../sheets/selectNationalitySheet';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { userJourneyStore } from '../stores/userJourneyStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { JourneyType, setAccessibilityProps } from '../types';
import { useAppTranslation } from "../hooks/useAppTranslation";
import { replaceWithDigits, isRTL, Language } from '../utils/formatter';
import { closeSheetModal } from '../utils/util';
import {
	isValidIqamahID,
	validateEmail,
	validatePhone,
} from '../utils/validate';
import CustomButton from './customButton';
import CustomInput from './customInput';
import CustomText from './customText';
import HtmlTextRenderer from './htmlTextRenderer';
import InfoPill from './infoPill';
import RadioButton from './radioButton';
import SVGIcon from './svgIcon';
import GenericSwitch from './switch';

type IdType = 'NATIONAL_ID' | 'PASSPORT' | 'UNKNOWN';

type PhoneNumberInputProps = {
	phoneNumber: string;
	phoneNumberError: string;
	countryCode: string;
	idType: 'NATIONAL_ID' | 'PASSPORT' | 'UNKNOWN';
	openCountriesSheet: ({
		includeCountryCode,
	}: { includeCountryCode?: boolean }) => void;
	onChangeText: (val: string) => void;
	isPhoneOptional: boolean;
	isPhoneDisbale: boolean;
};



const PhoneNumberInput: React.FC<PhoneNumberInputProps> = React.memo(
	({
		phoneNumber,
		phoneNumberError,
		countryCode,
		idType,
		openCountriesSheet,
		onChangeText,
		isPhoneOptional,
		isPhoneDisbale,
	}) => {
		const { fontPrimaryRegular, actionOpacity, animateOpacity } = constants;
		const { theme } = useUserPreferenceStore();
		const { journeyName } = userJourneyStore();
		const { t } = useAppTranslation();

		const phoneNumberHint = {
			[JourneyType.SWITCH_NUMBER]: t('label.switchNumberNote'),
			[JourneyType.ORDER_PACKAGE]: t('common.makesureNumActive'),
			ORDER_SIM: t('common.makesureNumActive'),
			ORDER_DEVICE: t('common.enterCurrentNum'),
		};
		if (
			idType !== 'PASSPORT' ||
			(idType === 'PASSPORT' && journeyName === 'SWITCH_NUMBER')
		) {
			return (
				<>
					<CustomInput
						containerClassName="mt-4"
						value={phoneNumber}
						error={phoneNumberError}
						label={
							journeyName === 'ORDER_SIM' ||
								journeyName === 'ORDER_DEVICE' ||
								journeyName === 'RESCHEDULE_ORDER'
								? t('label.phoneNumber') +
								(isPhoneOptional ? t('label.optional') : '')
								: t('label.switchNumber')
						}
						placeholder="05X XXX XXXX"
						onChangeText={onChangeText}
						keyboardType="phone-pad"
						shouldValidate={phoneNumber.length > 0}
						inputClassName={`${Platform.OS === 'web' && isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
						shouldFocus={false}
						labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
						hideInlineView={phoneNumberError.length === 0}
						maxLength={10}
						disabled={isPhoneDisbale}
					/>
					{Object.keys(phoneNumberHint).includes(journeyName as string) &&
						phoneNumberError.length === 0 && (
							<InfoPill
								texts={
									phoneNumberHint[journeyName as keyof typeof phoneNumberHint]
								}
								mainContainerClassName="items-center gap-2 mt-2"
								textClassName="!text-xs text-shades-gray-02 flex-1"
								leading={
									<SVGIcon
										name={'info'}
										width={14}
										height={14}
										viewBox="0 0 20 20"
									/>
								}
							/>
						)}
				</>
			);
		}

		return (
			<>
				<CustomInput
					containerClassName="mt-4"
					value={phoneNumber}
					error={phoneNumberError}
					label={t('label.phoneNumber')}
					placeholder="5X XXX XXXX"
					onChangeText={onChangeText}
					keyboardType="phone-pad"
					shouldValidate={false}
					inputClassName={`${Platform.OS === 'web' && isRTL() ? '!pr-[92px]' : '!ps-[92px]'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
					shouldFocus={false}
					labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
					hideInlineView={phoneNumberError.length === 0}
					leadingView={
						<View className="flex-row gap-[10px] relative">
							<Pressable
								className={`w-[52px] flex-row justify-between items-center ${actionOpacity} ${animateOpacity}`}
								onPress={() => openCountriesSheet({ includeCountryCode: true })}
							>
								<CustomText
									className={`text-sm text-secondary-gray ${fontPrimaryRegular}`}
								>
									{countryCode}
								</CustomText>
								<SVGIcon
									name="chevron"
									width={20}
									height={20}
									viewBox="0 0 24 24"
									stroke={Colors[theme].shadesGray01}
								/>
							</Pressable>
							<View className="h-[29px] bg-shades-gray-06 w-[1px]" />
						</View>
					}
					maxLength={10}
				/>
				<View className="flex-row mt-2 items-center gap-2">
					<SVGIcon name="info" width={14} height={14} viewBox="0 0 20 20" />
					<HtmlTextRenderer
						parentClassName={`text-xs text-shades-gray-02 flex-1 text-left text-start ${fontPrimaryRegular}`}
						html={t('label.provideWhatsAppNumber')}
						boldClassName="!text-secondary-blue"
					/>
				</View>
			</>
		);
	},
);

type EmailInputMode = 'input' | 'select';

type EmailInputProps = {
	email: string;
	emailError: string;
	onChangeText: (val: string) => void;
	mode?: EmailInputMode;
	onPress?: () => void;
};

export const EmailInput: React.FC<EmailInputProps> = React.memo(
	({ email, emailError, onChangeText, mode = 'input', onPress }) => {
		const { fontPrimaryRegular } = constants;
		const isSelectMode = mode === 'select';
		const { theme } = useUserPreferenceStore();

		const input = (
			<CustomInput
				containerClassName="mt-4"
				value={email}
				error={emailError}
				label="Email"
				placeholder="example@example.com"
				onChangeText={isSelectMode ? () => { } : onChangeText}
				shouldValidate={email.length > 0}
				inputClassName={`${Platform.OS === 'web' && isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular} !text-secondary-gray`}
				shouldFocus={false}
				labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
				hideInlineView={emailError.length === 0}
				keyboardType="email-address"
				disabled={isSelectMode} // 🔑 prevents keyboard
				overrideDisableClassName={true}
				onPressIn={isSelectMode && onPress ? onPress : () => { }}
				showErrorAsInfo={isSelectMode}
				trailingView={
					isSelectMode && (
						<View className="flex-row items-center gap-2">
							{email && (
								<SVGIcon
									name={'checkTick'}
									width={16}
									height={16}
									viewBox={'0 0 17 10'}
								/>
							)}
							<SVGIcon
								name={'chevron'}
								width={24}
								height={24}
								stroke={Colors[theme].shadesGray01}
							/>
						</View>
					)
				}
			/>
		);

		// Select mode → tap opens bottom sheet
		if (isSelectMode) {
			return (
				<Pressable
					onPress={() => {
						onPress?.();
					}}
				>
					{input}
				</Pressable>
			);
		}

		// Normal typing mode
		return input;
	},
);

type IDInputProps = {
	idValue: string;
	idError: string;
	idType: string;
	onChangeText: (val: string) => void;
	isBigScreen: boolean;
};

const IDInput: React.FC<IDInputProps> = React.memo(
	({ idValue, idError, idType, onChangeText, isBigScreen }) => {
		const { t } = useAppTranslation();
		return (
			<>
				<CustomInput
					containerClassName={isBigScreen ? 'mt-2' : 'mt-4'}
					value={idValue}
					error={idError}
					placeholder="1100100022"
					onChangeText={onChangeText}
					shouldValidate={idValue.length > 0}
					inputClassName={'!ps-5 !pe-10 !py-0 !text-[14px] !h-[48px]'}
					shouldFocus={false}
					labelClassName="text-sm text-shades-gray-01"
					hideInlineView={idError.length === 0}
					maxLength={idType === 'PASSPORT' ? 9 : 10}
				/>
				{idType === 'PASSPORT' && (
					<InfoPill
						texts={t('label.optionToUsePassport')}
						mainContainerClassName="items-center gap-2 mt-2"
						textClassName="!text-xs text-shades-gray-02 flex-1"
						leading={
							<SVGIcon
								name={'info'}
								width={14}
								height={14}
								viewBox="0 0 20 20"
							/>
						}
					/>
				)}
			</>
		);
	},
);

type ForeignInvestorViewProps = {
	idType: IdType;
	isForeignInvestor?: boolean;
	onChange: (value: boolean) => void;
	isBigScreen: boolean;
};

const ForeignInvestorView = React.memo(
	({
		idType,
		isForeignInvestor,
		onChange,
		isBigScreen,
	}: ForeignInvestorViewProps) => {
		if (idType !== 'PASSPORT') return null;
		const { t } = useAppTranslation();
		return (
			<View
				className={`${isBigScreen ? 'mt-1' : 'mt-4'} flex-row items-center gap-3`}
			>
				<GenericSwitch value={isForeignInvestor ?? false} onChange={onChange} />
				<CustomText
					fontVarient="regular"
					className="text-sm text-secondary-gray"
				>
					{t('label.areYouAForeignInvestor')}
				</CustomText>
			</View>
		);
	},
);

export type PersonalInfoFormState = {
	name: string;
	idValue: string;
	idType: IdType;
	email: string;
	selectedOperator?: OperatorsType;
	phoneNumber: string;
	idError: string;
	emailError: string;
	phoneNumberError: string;
	nationality: CountryItem;
	countryCode: string;
	selectedEmailByNationalId?: EmailItem;
	isForeignInvestor?: boolean;
};

type PersonalInformationProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	className?: string;
	form: PersonalInfoFormState;
	setForm: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
	isValidated: boolean;
	isPhoneOptional: boolean;
	isPhoneDisbale: boolean;
};

const PersonalInformationView: React.FC<PersonalInformationProps> = ({
	accessibilityLabel,
	nativeID = 'personal_information_view',
	className = '',
	form,
	setForm,
	isValidated,
	isPhoneOptional,
	isPhoneDisbale,
}) => {
	const { data: countries = [] } = useCountryList();
	const { data: operators = [] } = useOperatorDictionaryQuery();

	const { theme, language, userType } = useUserPreferenceStore();
	const { fontPrimaryRegular, fontPrimaryBold, actionOpacity, animateOpacity } =
		constants;
	const { setActiveSheet, activeSheet } = useBottomSheetStore();
	const { data: telcoEmails = [] } = useTelcoEmails();
	const nationalityRef = useRef<CountryItem>(countries?.[0]);
	const { journeyName } = userJourneyStore();
	const { width } = useWindowDimensions();
	const isTablet = width >= 768;
	const isDesktop = width >= 1024;
	const isBigScreen = isTablet || isDesktop;
	const isTelcoWithEmails = userType === 'TELCO' && telcoEmails.length > 0;
	const { t } = useAppTranslation();

	const name = language === Language.ar ? 'country_ar' : 'country_en';

	const update = (
		field: keyof PersonalInfoFormState,
		value: string | CountryItem | EmailItem | null | boolean,
	) => setForm((prev) => ({ ...prev, [field]: value }));

	const _validatelId = (_value: string) => {
		const value =
			form.idType === 'NATIONAL_ID' ? replaceWithDigits(_value) : _value;
		if (form.idType === 'NATIONAL_ID') {
			update('idValue', value);
			update('idError', '');
			if (!isValidIqamahID(value)) {
				update('idError', t('error.enterCorrectNationalID'));
			}
		} else if (form.idType === 'PASSPORT') {
			update('idValue', value);
			update('idError', '');
		}
	};

	const _validateEmail = (value: string) => {
		update('email', value);
		update('emailError', '');
		if (!validateEmail(value)) {
			update('emailError', t('error.enterCorrectEmail'));
		}
	};

	const _validatePhone = (_value: string) => {
		const value = replaceWithDigits(_value);
		update('phoneNumber', value);
		update('phoneNumberError', '');

		const isNationalId = form.idType === 'NATIONAL_ID';
		const isValidPhone = isNationalId
			? validatePhone(value)
			: value.length > 6 && value.length <= 10;

		if (!isValidPhone) {
			update('phoneNumberError', t('error.enterCorrectPhone'));
		}

		if (isNationalId && value.length === 10) {
			Keyboard.dismiss();
		}
	};

	const handleOperatorSheetContinuePress = () => {
		// if (Platform.OS !== 'web') {
		// 	setActiveSheet(null);
		// }
		closeSheetModal();
	};

	const handleNationalitySheetContinuePress = useCallback(
		(selectingCountryCodeOnly: boolean) => {
			if (nationalityRef.current) {
				// if (Platform.OS !== 'web') {
				// 	setActiveSheet(null);
				// }
				closeSheetModal();
				if (!selectingCountryCodeOnly) {
					update('nationality', nationalityRef.current);
				}
				update('countryCode', nationalityRef.current?.dial_code || '');
				userJourneyStore.getState().setJourneyState({
					countryCode: nationalityRef?.current.cournty_code,
					dialCode: nationalityRef?.current.dial_code,
				});
			}
		},
		[],
	);

	const renderBottomSheetFooter = useCallback(
		(
			props: BottomSheetFooterProps,
			selectingCountryCodeOnly: boolean,
			isNationalitySheet: boolean,
		) => (
			<BottomSheetFooter
				{...props}
				bottomInset={24}
				style={{ marginHorizontal: 20 }}
			>
				<CustomButton
					label={t('button.continue')}
					onPress={() => {
						isNationalitySheet
							? handleNationalitySheetContinuePress(selectingCountryCodeOnly)
							: handleOperatorSheetContinuePress();
					}}
				/>
			</BottomSheetFooter>
		),
		[setActiveSheet, activeSheet],
	);

	const openCountriesSheet = ({
		includeCountryCode = false,
	}: { includeCountryCode?: boolean } = {}) => {
		const selectedCountry = countries?.find((item) => {
			if (includeCountryCode && form.countryCode) {
				return (
					item?.dial_code?.toLowerCase() === form.countryCode.toLowerCase()
				);
			}
			if (!includeCountryCode && form.nationality) {
				return (
					item?.[name]?.toLowerCase() ===
					form.nationality?.[name]?.toLowerCase()
				);
			}
			return false;
		});
		Keyboard.dismiss();
		setActiveSheet('selectNationality', {
			snapPoints: ['80%'],
			title: includeCountryCode
				? t('label.selectYourCountryCode')
				: t('label.selectYourNationality'),

			props: {
				list: countries,
				onCountrySelect: (country) => {
					nationalityRef.current = country;
				},
				country: selectedCountry,
				type: includeCountryCode ? 'PICK_COUNTRY_CODE' : 'PICK_NATIONALITY',
				// onWebContinue: () =>
				// 	handleNationalitySheetContinuePress(includeCountryCode),
			} as SelectNationalitySheetProps,
			renderFooter: (props) =>
				renderBottomSheetFooter(props, includeCountryCode, true),
			enableDynamicSizing: false,
			// keyboardBehavior: 'interactive',
			enableBlurKeyboardOnGesture: true,
		});
	};

	const openOperatorSheet = () => {
		Keyboard.dismiss();
		setActiveSheet('selectOperatorSheet', {
			snapPoints: ['50%', '80%'],
			enableDynamicSizing: false,
			title: t('action.chooseYourOperator'),
			props: {
				list: operators,
				setForm: setForm,
				form: form,
				onWebContinue: () => handleOperatorSheetContinuePress(),
			},
			renderFooter: (props) => renderBottomSheetFooter(props, false, false),
		});
	};

	const NationalityView = () => {
		return (
			<>
				{/* Nationality */}
				<CustomText
					className={`text-sm text-shades-gray-01 mt-5 ${Platform.OS === 'web' ? 'text-start' : 'text-left'} ${fontPrimaryRegular}`}
				>
					{t('label.nationality')}
				</CustomText>
				<Pressable
					className={`border border-shades-gray-06 rounded-full mt-2 h-[48px] px-5 flex-row items-center gap-1 ${actionOpacity} ${animateOpacity}`}
					onPress={() => openCountriesSheet()}
				>
					<CustomText
						className={`text-sm ${form.nationality?.[name] ? 'text-secondary-gray' : 'text-shades-gray-05'} flex-1 ${Platform.OS === 'web' ? 'text-start !pr-[14px]' : 'text-left'} ${fontPrimaryRegular}`}
					>
						{form.nationality?.[name] ||
							t('action.chooseYourNationality')}
					</CustomText>
					{form.nationality?.[name] && (
						<SVGIcon
							name={'checkTick'}
							width={16}
							height={16}
							viewBox="0 0 17 10"
						/>
					)}
					<SVGIcon
						name={'chevron'}
						width={24}
						height={24}
						stroke={Colors[theme].shadesGray01}
					/>
				</Pressable>
			</>
		);
	};

	const OperatorView = () => {
		return (
			<>
				{/* Operator */}
				<CustomText
					className={`text-sm text-shades-gray-01 mt-5 ${Platform.OS === 'web' ? 'text-start' : 'text-left'} ${fontPrimaryRegular}`}
				>
					{t('label.chooseOperator')}
				</CustomText>
				<Pressable
					className={`border border-shades-gray-06 rounded-full mt-2 h-[48px] px-5 flex-row items-center gap-1 ${actionOpacity} ${animateOpacity}`}
					onPress={() => openOperatorSheet()}
				>
					<CustomText
						className={`text-sm ${form?.selectedOperator?.name?.length > 0 ? 'text-secondary-gray' : 'text-shades-gray-05'} flex-1 ${Platform.OS === 'web' ? 'text-start !pr-[14px]' : 'text-left'} ${fontPrimaryRegular}`}
					>
						{form?.selectedOperator?.name ||
							t('action.chooseYourOperator')}
					</CustomText>
					{form?.selectedOperator?.name?.length > 0 && (
						<SVGIcon
							name={'checkMark'}
							width={16}
							height={16}
							viewBox="0 0 17 16"
						/>
					)}
					<SVGIcon
						name={'chevron'}
						width={24}
						height={24}
						stroke={Colors[theme].shadesGray01}
					/>
				</Pressable>
			</>
		);
	};

	const IDSelectionView = () => {
		return (
			<View className="flex-row mt-5">
				<RadioButton
					containerClassName="!w-0 flex-1"
					presseableClassName="!justify-start"
					selected={form.idType === 'NATIONAL_ID'}
					onPress={() => {
						update('idType', 'NATIONAL_ID');
						update('idValue', '');
					}}
					label=""
					viewTrailingRadio={
						<CustomText
							className={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
						>
							{t('action.nationalIdIqamaPersonalInfo')}
						</CustomText>
					}
				/>

				<RadioButton
					containerClassName="!w-0 flex-1"
					presseableClassName="!justify-start"
					selected={form.idType === 'PASSPORT'}
					onPress={() => {
						update('idType', 'PASSPORT');
						update('idValue', '');
					}}
					label=""
					viewTrailingRadio={
						<CustomText
							className={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
						>
							{t('action.passportNo')}
						</CustomText>
					}
				/>
			</View>
		);
	};
	const renderChild = () => {
		if (journeyName === 'ORDER_DEVICE' || journeyName === 'RESCHEDULE_ORDER') {
			// NON_TELCO or GUEST => show phone input
			if (userType === 'NON_TELCO' || userType === 'TELCO') {
				return (
					<PhoneNumberInput
						phoneNumber={form.phoneNumber}
						phoneNumberError={form.phoneNumberError}
						countryCode={form.countryCode}
						idType={form.idType}
						onChangeText={_validatePhone}
						openCountriesSheet={openCountriesSheet}
						isPhoneOptional={isPhoneOptional}
						isPhoneDisbale={isPhoneDisbale}
					/>
				);
			}

			// Other user types
			return (
				<View>
					<CustomInput
						containerClassName="mt-4"
						value={form.name}
						error={''}
						label={t('label.name')}
						placeholder={t('placeholder.typeYourName')}
						onChangeText={(value) => update('name', value)}
						shouldValidate={form.name.length > 0}
						inputClassName={`${Platform.OS === 'web' && isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
						shouldFocus={false}
						labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
						hideInlineView
					/>
					<EmailInput
						email={form.email}
						emailError={form.emailError}
						onChangeText={_validateEmail}
					/>
					<PhoneNumberInput
						phoneNumber={form.phoneNumber}
						phoneNumberError={form.phoneNumberError}
						countryCode={form.countryCode}
						idType={form.idType}
						onChangeText={_validatePhone}
						openCountriesSheet={openCountriesSheet}
						isPhoneOptional={isPhoneOptional}
						isPhoneDisbale={isPhoneDisbale}
					/>
				</View>
			);
		}

		const openEmailSheet = () => {
			setActiveSheet('selectEmailSheet', {
				snapPoints: ['70%', '80%', '90%'],
				keyboardBehavior: 'fillParent',
				enableDynamicSizing: false,
				title: t('label.selectYourEmailAddress'),
				props: {
					emails: telcoEmails,
					onContinue: (selectedEmail: EmailItem) => {
						update('email', selectedEmail.email_id);
						update(
							'selectedEmailByNationalId',
							selectedEmail?.id ? selectedEmail : null,
						);
						update('emailError', '');
						closeSheetModal();
					},
					selectedEmail: form.email,
				},
			});
		};

		return (
			<>
				{/* Name Input */}
				<View className="">
					<CustomInput
						containerClassName="mt-4"
						value={form.name}
						error={''}
						label={t('label.name')}
						placeholder={t('placeholder.typeYourName')}
						onChangeText={(value) => update('name', value)}
						shouldValidate={form.name.length > 0}
						inputClassName={`${Platform.OS === 'web' && isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] ${fontPrimaryRegular}`}
						shouldFocus={false}
						labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
						hideInlineView
					/>
				</View>

				{isBigScreen ? (
					<>
						<View className="flex-row">
							<View className="flex-1 pe-6">
								<NationalityView />
							</View>
							<View className="flex-1 ps-6">
								<IDSelectionView />
								<IDInput
									idValue={form.idValue}
									idError={form.idError}
									idType={form.idType}
									onChangeText={_validatelId}
									isBigScreen={isBigScreen}
								/>
								<ForeignInvestorView
									idType={form.idType}
									isForeignInvestor={form.isForeignInvestor}
									onChange={(value) => update('isForeignInvestor', value)}
									isBigScreen={isBigScreen}
								/>
							</View>
						</View>
						<View className="flex-row">
							<View className="flex-1 pe-6">
								<EmailInput
									email={form.email}
									emailError={
										isTelcoWithEmails
											? t('label.chooseEmailOrAdd')
											: form.emailError
									}
									onChangeText={_validateEmail}
									mode={isTelcoWithEmails ? 'select' : 'input'}
									onPress={() => {
										if (isTelcoWithEmails) {
											openEmailSheet();
										}
									}}
								/>
							</View>

							<View className="flex-1 ps-6">
								<PhoneNumberInput
									phoneNumber={form.phoneNumber}
									phoneNumberError={form.phoneNumberError}
									countryCode={form.countryCode}
									idType={form.idType}
									onChangeText={_validatePhone}
									openCountriesSheet={openCountriesSheet}
									isPhoneOptional={isPhoneOptional}
									isPhoneDisbale={isPhoneDisbale}
								/>
							</View>
						</View>

						{journeyName === 'SWITCH_NUMBER' && <OperatorView />}
					</>
				) : (
					<>
						<NationalityView />
						<IDSelectionView />

						<IDInput
							idValue={form.idValue}
							idError={form.idError}
							idType={form.idType}
							onChangeText={_validatelId}
							isBigScreen={isBigScreen}
						/>
						<ForeignInvestorView
							idType={form.idType}
							isForeignInvestor={form.isForeignInvestor}
							onChange={(value) => update('isForeignInvestor', value)}
							isBigScreen={isBigScreen}
						/>
						<EmailInput
							email={form.email}
							emailError={
								isTelcoWithEmails
									? t('label.chooseEmailOrAdd')
									: form.emailError
							}
							onChangeText={_validateEmail}
							mode={isTelcoWithEmails ? 'select' : 'input'}
							onPress={() => {
								if (isTelcoWithEmails) {
									openEmailSheet();
								}
							}}
						/>
						{journeyName === 'SWITCH_NUMBER' && <OperatorView />}

						<PhoneNumberInput
							phoneNumber={form.phoneNumber}
							phoneNumberError={form.phoneNumberError}
							countryCode={form.countryCode}
							idType={form.idType}
							onChangeText={_validatePhone}
							openCountriesSheet={openCountriesSheet}
							isPhoneOptional={isPhoneOptional}
							isPhoneDisbale={isPhoneDisbale}
						/>
					</>
				)}
			</>
		);
	};

	return (
		<View
			className={`bg-secondary-white rounded-xl p-4 ${className}`}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			{/* Header */}
			<View className="flex-row">
				<CustomText
					className={`text-secondary-gray text-base flex-1 ${Platform.OS === 'web' ? 'text-start' : 'text-left'
						} ${fontPrimaryBold}`}
				>
					{t('label.personalInformation')}
				</CustomText>
				{isValidated && (
					<SVGIcon
						name={'tickCircle'}
						width={20}
						height={20}
						viewBox="0 0 20 20"
						pathFill={Colors[theme].secondaryGreen}
					/>
				)}
			</View>

			{renderChild()}
		</View>
	);
};

export default PersonalInformationView;

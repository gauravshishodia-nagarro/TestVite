import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { CardResponse } from '../apis/types/payment';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import GenericImage from '../components/image';
import SVGIcon from '../components/svgIcon';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import { replaceWithDigits, isRTL } from '../utils/formatter';
import { validateCvv } from '../utils/validate';
import { useAppTranslation } from '../hooks/useAppTranslation';

export type ShowCardSheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	handleSelectedCard: (card: CardResponse, cvv: string) => void;
	handleAddCard: () => void;
	cards: CardResponse[];
	title?: string;
	onBackPress?: () => void;
};

const ShowCardSheet: React.FC = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
	const { t: strings } = useAppTranslation();

	const {
		nativeID = 'add_card',
		accessibilityLabel,
		handleSelectedCard,
		handleAddCard,
		cards = [],
	}: ShowCardSheetProps = bottomSheetOptions.props;

	const {
		fontPrimaryRegular,
		fontPrimaryMedium,
		animateColors,
		MAX_CARD_ADD_LIMIT,
	} = constants;
	const { theme } = useUserPreferenceStore();

	const [selectedCard, setSelectedCard] = useState<CardResponse>(
		cards.find((card) => card.is_default_card) || cards[0],
	);
	const [CVV, setCVV] = useState('');
	const [CVVError, setCVVError] = useState('');

	const _validateCvv = (_value: string) => {
		const value = replaceWithDigits(_value);
		setCVV(value);
		setCVVError('');

		if (!validateCvv(value)) {
			setCVVError(strings('error.cardCvvError'));
		}
	};

	const isValid = () => {
		return selectedCard && CVV.length > 0 && CVVError.length === 0;
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

	return (
		<View
			className="pb-8 px-5 gap-4"
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			{/* {onBackPress ? (
				<Pressable
					className="w-10 h-10 items-center justify-center rounded-full bg-black/5 mb-2"
					onPress={onBackPress}
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
			) : null}
			<CustomText
				className={`text-secondary-gray text-xl text-left text-start ${fontPrimaryBold}`}
			>
				{title}
			</CustomText> */}
			<View className="mt-4 p-4 bg-secondary-white rounded-xl gap-4">
				<CustomText
					className={`text-shades-gray-03 text-sm text-left text-start pb-2 ${fontPrimaryRegular}`}
				>
					{strings('label.chooseCard')}
				</CustomText>

				{cards.map((card) => {
					const isSelected = selectedCard?.id === card.id;
					return (
						<Pressable
							key={card.id}
							onPress={() => setSelectedCard(card)}
							className={`rounded-2xl border py-4 px-3 gap-4 ${isSelected ? 'border-secondary-blue bg-shades-blue-06' : 'border-shades-gray-06 bg-secondary-white'}`}
						>
							{card.is_default_card && (
								<View
									key={card.id}
									className="absolute top-[-15px] end-2 px-2 py-1 rounded-3xl bg-shades-green-06 border-[2px] border-secondary-white"
								>
									<CustomText
										className={`${fontPrimaryRegular} text-xxs text-secondary-green`}
									>
										{strings('label.defaultCard')}
									</CustomText>
								</View>
							)}
							<View className="flex-row items-center">
								<GenericImage
									uri={cardIcon(card.card_type)}
									width="w-[37px]"
									height="h-[24px]"
									resizeMode="contain"
								/>
								<View className="px-3 flex-1">
									<CustomText
										className={`text-secondary-gray text-sm ${fontPrimaryMedium}`}
									>
										{`${card.card_number?.slice(-8) ?? ''} ${card.card_holder_name ?? ''} `}
									</CustomText>
									<CustomText
										className={`text-shades-gray-02 text-xs ${fontPrimaryRegular}`}
									>
										{card.card_type}
									</CustomText>
								</View>
								<View
									className={`w-6 h-6 web:border-[2px] border-[1.5px] rounded-full flex items-center justify-center ${animateColors} ${
										isSelected
											? 'border-secondary-gray'
											: 'border-shades-gray-05'
									}`}
								>
									<View
										className={`w-[11px] h-[11px] rounded-full ${isSelected ? 'bg-secondary-gray' : 'bg-transparent'} ${animateColors}`}
									/>
								</View>
							</View>

							{isSelected && (
								<>
									<Divider containerClassName="!bg-shades-blue-05" />
									<View className="flex-row items-center gap-6">
										<View className="flex-1 gap-1 flex-row items-center">
											<CustomText
												className={`text-base text-shades-gray-01  ${fontPrimaryRegular}`}
											>
												{strings('placeholder.enterCVV')}
											</CustomText>
											<SVGIcon
												name={'info'}
												width={20}
												height={20}
												viewBox="0 0 20 20"
											/>
										</View>
										<CustomInput
											value={CVV}
											error={CVVError}
											placeholder="***"
											shouldValidate={false}
											inputClassName={`${Platform.OS === 'web' && isRTL() ? '' : '!ps-5'} !pe-10 !py-0 !text-[14px] !h-[48px] !rounded-[8px] ${fontPrimaryRegular}`}
											shouldFocus={false}
											labelClassName={`text-sm text-shades-gray-01 ${fontPrimaryRegular}`}
											hideInlineView={true}
											keyboardType="numeric"
											secureTextEntry
											onChangeText={_validateCvv}
											containerClassName="!w-[100px]"
											maxLength={4}
										/>
									</View>
								</>
							)}
						</Pressable>
					);
				})}

				{cards.length < MAX_CARD_ADD_LIMIT && (
					<Pressable
						className="border border-shades-gray-06 rounded-2xl px-3 py-4 gap-3 flex-row items-center"
						onPress={handleAddCard}
					>
						<SVGIcon
							name={'addCircle'}
							width={20}
							height={20}
							viewBox="0 0 20 20"
							pathFill={Colors[theme].secondaryBlue}
						/>
						<CustomText
							className={`text-secondary-blue text-base ${fontPrimaryMedium}`}
						>
							{strings('button.addCard')}
						</CustomText>
					</Pressable>
				)}
			</View>
			<CustomButton
				label={strings('button.continue')}
				onPress={() => {
					handleSelectedCard(selectedCard, CVV);
				}}
				disabled={!isValid()}
				filledBorderColor={
					isValid() ? 'border-secondary-gray' : 'border-shades-gray-04'
				}
				containerClassName="mt-3"
			/>
		</View>
	);
};

export default ShowCardSheet;

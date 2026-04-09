import React from 'react';
import { Text, View } from 'react-native';
import constants from '../configs/constants';
import { setAccessibilityProps } from '../types';
import CustomText from './customText';
import PriceWithCurrencey from './priceWithCurrencey';

type TransactionDetailItemProps = {
	leadingLabel: string;
	price: number;
	discount?: number;
	nativeID?: string;
	accessibilityLabel?: string;
	containerClassName?: string;
	leadingLabelClassName?: string;
	leadingLabelFont?: string;
	trailingLabelClassName?: string;
	trailinglabelFont?: string;
	strikeLabelClassName?: string;
	strikeLabelFont?: string;
	currencyIconWidth?: number;
	currencyIconHeight?: number;
	strikeCurrencyIconWidth?: number;
	strikeCurrencyIconHeight?: number;
	currencyColor?: string;
	strikeCurrencyColor?: string;
	showCurrenyInNegative?: boolean;
	showFree?: boolean;
};

const TransactionDetailItem: React.FC<TransactionDetailItemProps> = ({
	leadingLabel,
	price,
	discount = 0,
	nativeID = 'transaction_item',
	accessibilityLabel,
	containerClassName = '',
	leadingLabelClassName = '',
	leadingLabelFont = constants.fontPrimaryMedium,
	trailingLabelClassName = '',
	trailinglabelFont = constants.fontPrimaryMedium,
	strikeLabelFont = constants.fontPrimaryRegular,
	strikeLabelClassName = '',
	currencyIconWidth = 12,
	currencyIconHeight = 14,
	strikeCurrencyIconWidth = 12,
	strikeCurrencyIconHeight = 14,
	currencyColor,
	strikeCurrencyColor,
	showCurrenyInNegative = false,
	showFree = true,
}) => {
	const finalAmount = price - discount;
	const showStriked = finalAmount >= 0 && discount > 0;
	return (
		<View
			className={`flex-row justify-between items-center w-full ${containerClassName}`}
			{...setAccessibilityProps({
				nativeID,
				accessibilityLabel,
			})}
		>
			<CustomText
				className={`text-sm text-shades-gray-02 ${leadingLabelFont} ${leadingLabelClassName}`}
				accessibilityRole="text"
			>
				{leadingLabel}
			</CustomText>

			<View className="flex-row items-center gap-2">
				{showStriked && (
					<PriceWithCurrencey
						price={price}
						customTextClassName={`text-shades-gray-02 text-sm ${strikeLabelFont} ${strikeLabelClassName}`}
						customDecimalTextClassName={'text-xxs'}
						width={strikeCurrencyIconWidth}
						height={strikeCurrencyIconHeight}
						showStrikeThroughLine
						{...(strikeCurrencyColor && { bgColor: strikeCurrencyColor })}
					/>
				)}
				{finalAmount === 0 && showFree ? (
					<CustomText
						className={`text-sm text-shades-gray-01 ${trailinglabelFont} ${trailingLabelClassName} `}
						accessibilityRole="text"
					>
						Free
					</CustomText>
				) : (
					<PriceWithCurrencey
						price={finalAmount}
						customTextClassName={`text-sm text-shades-gray-01 ${trailinglabelFont} ${trailingLabelClassName}`}
						customDecimalTextClassName={'text-xxs'}
						width={currencyIconWidth}
						height={currencyIconHeight}
						showCurrenyInNegative={showCurrenyInNegative}
						{...(currencyColor && { bgColor: currencyColor })}
					/>
				)}
			</View>
		</View>
	);
};

export default TransactionDetailItem;

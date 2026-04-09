import React from 'react';
import { View } from 'react-native';
import constants from '../configs/constants';
import { setAccessibilityProps } from '../types';
import GenericImage from './image';

const cardIcons = [
	{
		name: constants.creditCardType.visa,
		width: 'w-[25px]',
		height: 'h-[16px]',
		containerStyle: '',
		icon: require('../../public/images/visa-blue-bg.webp'),
	},
	{
		name: constants.creditCardType.mastercard,
		width: 'w-[25px]',
		height: 'h-[16px]',
		containerStyle: '',
		icon: require('../../public/images/master-card.webp'),
	},
	{
		name: constants.creditCardType.mada,
		width: 'w-[70px]',
		height: 'h-[16px]',
		containerStyle: '-ml-[10px]',
		icon: require('../../public/images/mada.webp'),
	},
];

type AcceptedCardsProps = {
	containerClassName?: string;
	nativeID?: string;
	accessibilityLabel?: string;
};

const AcceptedCards: React.FC<AcceptedCardsProps> = ({
	containerClassName = '',
	nativeID = 'accepted_cards',
	accessibilityLabel,
}) => {
	return (
		<View
			className={`flex-row flex-wrap items-center gap-[5px] ${containerClassName}`}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			{cardIcons.map((card, index) => (
				<View key={index} className={card.containerStyle}>
					<GenericImage
						uri={card.icon}
						width={card.width}
						height={card.height}
						resizeMode="contain"
					/>
				</View>
			))}
		</View>
	);
};

export default AcceptedCards;

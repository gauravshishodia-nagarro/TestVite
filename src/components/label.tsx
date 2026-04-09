import type React from 'react';
import constants from '../configs/constants';
import CustomText from './customText';

interface LabelProps {
	label: string;
	labelClassName: string;
}

const Label: React.FC<LabelProps> = ({ label, labelClassName }) => {
	const { fontPrimaryMedium } = constants;
	return (
		<CustomText
			className={`${fontPrimaryMedium} text-start ios:rtl:text-left text-base text-shades-gray-01 mb-2 ${labelClassName}`}
		>
			{label}
		</CustomText>
	);
};

export default Label;

import React, { useEffect, useRef } from 'react';

import constants from '../configs/constants';
import { formatSecondsToMinsSecs } from '../utils/formatter';
import CustomText from './customText';

interface TimerProps {
	seconds: number;
	setSeconds: React.Dispatch<React.SetStateAction<number>>;
	nativeID?: string;
	accessibilityLabel?: string;
	textClassName?: string;
}

const Timer: React.FC<TimerProps> = ({
	seconds,
	setSeconds,
	nativeID = 'timer_component',
	accessibilityLabel,
	textClassName = '',
}) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const { fontPrimaryMedium } = constants;

	useEffect(() => {
		setSeconds(seconds);
	}, [seconds]);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setSeconds((prev) => {
				const updated = prev > 0 ? prev - 1 : 0;
				return updated;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	return (
		<CustomText
			className={`text-secondary-gray text-center text-sm ${fontPrimaryMedium} ${textClassName}`}
			nativeID={nativeID}
			accessibilityLabel={accessibilityLabel || 'Countdown Timer'}
		>
			{`${formatSecondsToMinsSecs(seconds)}s`}
		</CustomText>
	);
};

export default Timer;

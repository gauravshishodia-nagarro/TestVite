import React, { useEffect } from 'react';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';

type PropsType = {
	width?: number;
	height?: number;
	indicatorColor?: string;
};

export const Spinner: React.FC<PropsType> = React.memo(
	({ width = 24, height = 24, indicatorColor }) => {
		const theme = useUserPreferenceStore((state) => state.theme);
		const borderColor = indicatorColor ?? Colors[theme].secondaryBlue;
		const animVal = useSharedValue(0);
		const styles = useAnimatedStyle(() => {
			return {
				transform: [{ rotate: `${animVal.get()}deg` }],
			};
		});

		useEffect(() => {
			animVal.value = withRepeat(
				withTiming(360, { duration: 1000, easing: Easing.linear }),
				0,
			);
		}, [animVal]);
		return (
			<Animated.View
				style={[styles, { width, height, borderBottomColor: borderColor }]}
				className="rounded-full border-[4px] border-solid border-secondary-white self-center"
			/>
		);
	},
);

import { AnimatePresence, MotiView, motify } from 'moti';
import React, { ReactNode, useEffect, useState } from 'react';
import {
	Dimensions,
	LayoutChangeEvent,
	Modal,
	Pressable,
	PressableProps,
	StyleSheet,
	View,
} from 'react-native';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useCustomAlertStore } from '../stores/useCustomAlert';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import CustomText from './customText';
import SVGIcon, { IconProps } from './svgIcon';

type AlertPosition = 'top' | 'bottom' | 'center';

export type CustomAlertProps = {
	title?: string;
	message: string | ReactNode;
	buttonText: string | ReactNode;
	afterHiddenCallback: () => void;
	onButtonPress: PressableProps['onPress'];
	position?: AlertPosition;
	nativeID?: string;
	accessibilityLabel?: string;
	containerClassName?: string;
	showIcon?: boolean;
	iconName?: string;
	iconProps?: Partial<IconProps>;
	showConfetti?: boolean;
};

const MotiButton = motify(Pressable)();
const windowHeight = Dimensions.get('window').height;

const CustomAlert: React.FC = () => {
	const theme = useUserPreferenceStore((state) => state.theme);
	const { visible, exiting, props, hideAlert, completeHide } =
		useCustomAlertStore();
	const { fontPrimaryMedium, tabScreenBottomPadding } = constants;
	const {
		showIcon,
		iconName,
		iconProps,
		containerClassName,
		title,
		message,
		buttonText,
		onButtonPress,
		position,
		showConfetti,
	} = props;
	const [layout, setLayout] = useState({
		width: 100,
		height: 100,
	});
	// const confettiRef = useRef<PIConfettiMethods>(null); Not needed for web

	const getPositionStyle = (): object => {
		switch (position ?? 'bottom') {
			case 'top':
				return { top: '10%' };
			case 'center':
				return { top: windowHeight / 2 - layout.height / 2 };
			default:
				return { bottom: tabScreenBottomPadding - 20 };
		}
	};

	const onLayout = (e: LayoutChangeEvent) => {
		setLayout({
			width: e.nativeEvent.layout.width ?? 100,
			height: e.nativeEvent.layout.height ?? 100,
		});
	};

	useEffect(() => {
		// if (visible && showConfetti) {
			//this will be repalced by lottie
			// confettiRef.current?.restart(); not needed for web
		// }
	}, [visible, showConfetti]); //not needed for web

	return (
		<Modal
			transparent
			animationType="none"
			visible={visible}
			onRequestClose={hideAlert}
			style={{
				flex: 1,
				marginHorizontal: 16,
				justifyContent: 'center',
			}}
		>
			<MotiButton
				onPress={hideAlert}
				from={{ opacity: 0 }}
				animate={{ opacity: exiting ? 0 : 0.5 }}
				exit={{ opacity: exiting ? 0 : 0.5 }}
				style={{
					...StyleSheet.absoluteFillObject,
					position: 'absolute',
					backgroundColor: Colors[theme].shadesGray01,
				}}
			/>
			<AnimatePresence
				onExitComplete={() => {
					// clear from store after exit animation
					completeHide();
				}}
			>
				{!exiting && (
					<MotiView
						onLayout={onLayout}
						from={{ opacity: 0, translateY: 20 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 20 }}
						className={'absolute left-5 right-5 items-center'}
						style={[getPositionStyle(), { transform: [{ translateY: -900 }] }]}
						{...setAccessibilityProps({
							nativeID: props?.nativeID ?? 'custom_alert',
							accessibilityLabel: props?.accessibilityLabel,
						})}
					>
						{/* {showConfetti && !isWeb() ? (
							<PIConfetti
								ref={confettiRef}
								blastPosition={{
									x: layout.width / 2,
									y: layout.height / 2 - 32,
								}}
								count={180}
								flakeSize={{ width: 4, height: 8 }}
								blastDuration={1200}
								fallDuration={5200}
								fadeOutOnEnd
								colors={['#FF5252', '#FFD740', '#69F0AE', '#40C4FF', '#E040FB']}
							/>
						) : null} */}

						<View
							className={`bg-secondary-white p-4 rounded-2xl justify-center items-center ${containerClassName ?? ''}`}
							style={{
								shadowColor: Colors[theme].black,
								shadowOffset: { width: -10, height: 4 },
								shadowOpacity: 0.25,
								shadowRadius: 15,
								elevation: 5,
								backgroundColor: Colors[theme].secondaryWhite,
							}}
						>
							{showIcon && iconName ? (
								<View className="w-[72px] h-[72px]  items-center justify-center mb-2">
									<SVGIcon
										name={iconName}
										pathFill={
											iconProps?.pathFill ?? Colors[theme].secondaryBlue
										}
										{...iconProps}
									/>
								</View>
							) : null}

							{typeof title === 'string' ? (
								<CustomText
									fontVarient="bold"
									className={`text-base text-secondary-gray text-center mb-2 ${fontPrimaryMedium}`}
								>
									{title}
								</CustomText>
							) : (
								title
							)}
							{typeof message === 'string' ? (
								<CustomText
									fontVarient="regular"
									className="text-xs text-shades-gray-02 text-center mb-4"
								>
									{message}
								</CustomText>
							) : (
								message
							)}
							{typeof buttonText === 'string' ? (
								<Pressable
									onPress={onButtonPress ?? hideAlert}
									className="flex justify-center items-center border-t border-shades-purple-06 pt-3"
									style={{
										width: layout.width - 32,
										borderTopColor: Colors[theme].shadesPurple06,
									}}
								>
									<CustomText
										fontVarient="medium"
										className="text-sm text-secondary-blue"
									>
										{props.buttonText}
									</CustomText>
								</Pressable>
							) : (
								buttonText
							)}
						</View>
					</MotiView>
				)}
			</AnimatePresence>
		</Modal>
	);
};

export default CustomAlert;

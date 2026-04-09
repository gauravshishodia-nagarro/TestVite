import { AnimatePresence, MotiView } from 'moti';
import React, { ReactNode, useEffect } from 'react';
import { Modal, TouchableOpacity, View, ViewStyle } from 'react-native';
import constants from '../configs/constants';
import { Colors, Themes } from '../configs/themes';
import { useFloatingToastStore } from '../stores/useFloatingToastStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import CustomText from './customText';
import SVGIcon from './svgIcon';

type ToastPosition = 'top' | 'bottom' | 'center';

export type FloatingToastProps = {
	message: string | ReactNode;
	duration?: number; // in ms
	onDismiss: () => void;
	position?: ToastPosition;
	autoDismiss?: boolean;
	nativeID?: string;
	accessibilityLabel?: string;
	toastPositionStyle?: ViewStyle;
	containerClassName?: string;
	icon?: string;
	iconWidth?: number;
	iconHeight?: number;
	iconViewBox?: string;
	showCrossIcon?: boolean;
};

const FloatingToast: React.FC = () => {
	const { theme } = useUserPreferenceStore();
	const { fontPrimaryMedium, tabScreenBottomPadding } = constants;
	const { visible, exiting, props, hideToast, completeHide } =
		useFloatingToastStore();

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (props?.autoDismiss && visible) {
			timer = setTimeout(() => {
				hideToast();
			}, props.duration ?? 3000);
		}
		return () => clearTimeout(timer);
	}, [visible, props, hideToast]);

	if (!visible || !props) return null;

	const getPositionStyle = (): object => {
		switch (props?.position ?? 'bottom') {
			case 'top':
				return { top: '10%' };
			case 'center':
				return { top: '50%', transform: [{ translateY: -40 }] };
			default:
				return { bottom: tabScreenBottomPadding - 20 };
		}
	};

	return (
		<Modal
			transparent
			animationType="none"
			visible={visible}
			onRequestClose={hideToast}
		>
			<View style={[{ flex: 1 }, Themes[theme]]}>
				<AnimatePresence
					onExitComplete={() => {
						// clear from store after exit animation
						completeHide();
					}}
				>
					{!exiting && (
						<MotiView
							from={{ opacity: 0, translateY: 20 }}
							animate={{ opacity: 1, translateY: 0 }}
							exit={{ opacity: 0, translateY: 20 }}
							className={'absolute left-5 right-5 z-50 items-center'}
							style={[getPositionStyle(), props?.toastPositionStyle ?? {}]}
							{...setAccessibilityProps({
								nativeID: props?.nativeID ?? 'floating_toast',
								accessibilityLabel: props?.accessibilityLabel,
							})}
						>
							<View
								className={`bg-secondary-blue px-4 py-3 flex-row rounded-xl justify-center items-center ${props?.containerClassName ?? ''}`}
								style={{
									shadowColor: Colors[theme].black,
									shadowOffset: { width: -10, height: 4 },
									shadowOpacity: 0.25,
									shadowRadius: 15,
									elevation: 5,
								}}
							>
								<SVGIcon
									name={props?.icon ?? 'tickCircle'}
									width={props?.iconWidth ?? 20}
									height={props?.iconHeight ?? 20}
									viewBox={props?.iconViewBox ?? '0 0 20 20'}
								/>
								{typeof props?.message === 'string' ? (
									<CustomText
										className={`flex-1 mx-3 text-base text-secondary-white ${fontPrimaryMedium}`}
									>
										{props?.message}
									</CustomText>
								) : (
									props?.message
								)}
								{props?.showCrossIcon && (
									<TouchableOpacity onPress={hideToast}>
										<SVGIcon
											name={'close'}
											width={24}
											height={24}
											viewBox="0 0 20 20"
											stroke={Colors[theme].secondaryWhite}
										/>
									</TouchableOpacity>
								)}
							</View>
						</MotiView>
					)}
				</AnimatePresence>
			</View>
		</Modal>
	);
};

export default FloatingToast;

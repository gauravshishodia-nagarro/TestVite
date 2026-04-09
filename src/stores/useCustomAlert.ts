// stores/toastStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CustomAlertProps } from '../components/customAlert';

interface CustomAlertState {
	visible: boolean;
	exiting: boolean;
	props: CustomAlertProps;
	showAlert: (props: Partial<CustomAlertProps>) => void;
	hideAlert: () => void;
	completeHide: () => void;
}

const defaultProps: CustomAlertProps = {
	position: 'center',
	title: '',
	message: '',
	buttonText: 'Close',
	afterHiddenCallback: () => {},
	onButtonPress: undefined,
	nativeID: 'custom_alert',
	accessibilityLabel: undefined,
	containerClassName: '',
	showIcon: true,
	iconName: 'tickCircle',
	iconProps: {
		width: 60,
		height: 60,
		viewBox: '0 0 20 20',
	},
	showConfetti: false,
};

export const useCustomAlertStore = create<CustomAlertState>()(
	devtools(
		(set, get) => ({
			visible: false,
			exiting: false,
			props: defaultProps,

			showAlert: (props) =>
				set({
					visible: true,
					exiting: false,
					props: { ...defaultProps, ...props },
				}),

			hideAlert: () =>
				set({
					exiting: true,
				}),
			completeHide: () => {
				const {
					props: { afterHiddenCallback },
				} = get();
				afterHiddenCallback?.();
				set({ visible: false, exiting: false, props: defaultProps });
			},
		}),
		{ name: 'CustomAlertStore' },
	),
);

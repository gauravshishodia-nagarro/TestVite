// stores/toastStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FloatingToastProps } from '../components/floatingToast';

interface FloatingToastState {
	visible: boolean;
	exiting: boolean;
	props: FloatingToastProps;
	showToast: (props: Partial<FloatingToastProps>) => void;
	hideToast: () => void;
	completeHide: () => void; // clears after exit animation
}

const defaultProps: FloatingToastProps = {
	message: '',
	duration: 3000,
	onDismiss: () => {},
	position: 'bottom',
	autoDismiss: true,
	nativeID: 'floating_toast',
	accessibilityLabel: undefined,
	toastPositionStyle: {},
	containerClassName: '',
	icon: 'tickCircle',
	iconWidth: 20,
	iconHeight: 20,
	iconViewBox: '0 0 20 20',
	showCrossIcon: true,
};

export const useFloatingToastStore = create<FloatingToastState>()(
	devtools(
		(set, get) => ({
			visible: false,
			exiting: false,
			props: defaultProps,

			showToast: (props) =>
				set({
					visible: true,
					exiting: false,
					props: { ...defaultProps, ...props },
				}),

			hideToast: () =>
				set({
					exiting: true,
				}),
			completeHide: () => {
				const { props } = get();
				props.onDismiss?.(); // ✅ call onDismiss after fully hidden
				set({ visible: false, exiting: false, props: defaultProps });
			},
		}),
		{ name: 'FloatingToastStore' },
	),
);

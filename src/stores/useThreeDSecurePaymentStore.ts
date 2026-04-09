import { create } from 'zustand';

export type PayfortWebViewSourceType =
	| { uri: string }
	| { html: string; baseUrl?: string }
	| {
			uri: string;
			method?: 'GET' | 'POST';
			headers?: Record<string, string>;
			body?: string;
	  };

type CallbackKeys = 'onNavigationStateChange' | 'onMessage';

type ThreeDSecureStoreType = {
	callbacks: Partial<Record<CallbackKeys, (...args: any[]) => void>>;
	webViewSource?: PayfortWebViewSourceType;

	// Actions
	setCallback: (key: CallbackKeys, cb: (...args: any[]) => void) => void;
	clearCallback: (key: CallbackKeys) => void;

	// WebView helpers
	setWebViewSource: (src: PayfortWebViewSourceType) => void;
	clearWebViewSource: () => void;
};

export const useThreeDSecurePaymentStore = create<ThreeDSecureStoreType>(
	(set) => ({
		callbacks: {},
		webViewSource: undefined,

		setCallback: (key, cb) =>
			set((state) => ({
				callbacks: { ...state.callbacks, [key]: cb },
			})),

		clearCallback: (key) =>
			set((state) => {
				const updated = { ...state.callbacks };
				delete updated[key];
				return { callbacks: updated };
			}),

		setWebViewSource: (src) => set({ webViewSource: src }),
		clearWebViewSource: () => set({ webViewSource: undefined }),
	}),
);

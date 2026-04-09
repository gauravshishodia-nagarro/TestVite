import { NavigationProp, useNavigation } from '@react-navigation/native';
import BasicHeader from '../../components/basicHeader';
import Loader from '../../components/loader';
import { endpoints } from '../../configs/endpoints';
import { useThreeDSecurePaymentStore } from '../../stores/useThreeDSecurePaymentStore';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import WebView, {
	WebViewMessageEvent,
	WebViewNavigation,
} from 'react-native-webview';
import { WebViewEvent } from 'react-native-webview/lib/WebViewTypes';

const ThreeDSecureView: React.FC = () => {
	const navigation = useNavigation<NavigationProp<any>>();

	const { callbacks, webViewSource, clearCallback, clearWebViewSource } =
		useThreeDSecurePaymentStore();
	const [isLoading, setLoading] = useState(false);
	const threeDWindow = useRef<Window>(null);
	const isMessageHandledRef = useRef(false);

	useEffect(() => {
		return () => {
			clearWebViewSource();
			clearCallback('onNavigationStateChange');
			clearCallback('onMessage');
		};
	}, [clearCallback, clearWebViewSource]);

	useEffect(() => {
		if (Platform.OS === 'web') {
			if (webViewSource?.body) {
				const form = document.createElement('form');
				form.method = 'post';
				form.action = endpoints.payfort.tokenizationDev;
				form.target = 'frame';
				// form.target = 'payfort_iframe';
				for (const [key, value] of Object.entries(webViewSource?.body)) {
					const hiddenField = document.createElement('input');
					hiddenField.type = 'hidden';
					hiddenField.name = key;
					hiddenField.value = value;
					form.appendChild(hiddenField);
				}
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
				setLoading(true);
			} else if (webViewSource?.uri) {
				setLoading(true);
				threeDWindow.current = window.open(webViewSource?.uri, '_blank');
			}
		}
	}, [webViewSource]);

	useEffect(() => {
		if (Platform.OS === 'web') {
			window.addEventListener('message', handleMessage);
		}
		return () => {
			if (Platform.OS === 'web') {
				window.removeEventListener('message', handleMessage);
			}
		};
	}, []);

	const handleOnNavigationStateChange = (event: WebViewNavigation) => {
		callbacks?.onNavigationStateChange?.(event);
	};

	const handleMessage = (event: WebViewMessageEvent | MessageEvent) => {
		setLoading(false);
		let rawEventData: any;
		if (Platform.OS === 'web') {
			rawEventData = (event as MessageEvent).data;
		} else {
			rawEventData = (event as WebViewEvent).nativeEvent?.data;
		}
		//Tabby return authorized then stay in webview
		if (rawEventData === 'authorized') {
			return;
		}

		if (isMessageHandledRef.current) {
			return;
		}
		isMessageHandledRef.current = true;

		if (Platform.OS === 'web') {
			const origin = (event as MessageEvent)?.origin ?? '';
			if (origin.startsWith('https://uatokd.maanaginx.com')) {
				callbacks?.onMessage?.(rawEventData);
				threeDWindow?.current?.close?.();
			}
		} else {
			callbacks?.onMessage?.(rawEventData);
		}

		setTimeout(() => {
			navigation.goBack();
		}, 100);
	};

	return (
		<View className="flex-1">
			<BasicHeader title="" />
			{Platform.OS === 'web' ? (
				<iframe
					name="frame"
					title="test"
					id="iframeId"
					width="100*"
					height="100%"
					src=""
					frameBorder="0"
					onLoad={() => setLoading(false)}
				/>
			) : (
				<WebView
					source={webViewSource}
					bounces={false}
					cacheEnabled={false}
					allowsLinkPreview={false}
					keyboardDisplayRequiresUserAction={false}
					automaticallyAdjustContentInsets={false}
					autoFocus
					scalesPageToFit
					startInLoadingState
					domStorageEnabled
					javaScriptEnabled
					allowFileAccessFromFileURLs
					originWhitelist={['*']}
					mixedContentMode="always"
					onNavigationStateChange={handleOnNavigationStateChange}
					onMessage={handleMessage}
					{...(Platform.OS !== 'android' && {
						dataDetectorTypes: 'none',
					})}
				/>
			)}
			<Loader loading={isLoading} />
		</View>
	);
};

export default ThreeDSecureView;

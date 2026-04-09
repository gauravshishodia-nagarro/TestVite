import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { Colors } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import Badge from './badge';
import CustomText from './customText';
import GenericImage from './image';
import GenericSwitch from './switch';
import { useAppTranslation } from '../hooks/useAppTranslation';

type Props = {
	autoRenewEnabled?: boolean;
	onAutoRenewPress: (enabled: boolean) => void;
	isDisabled?: boolean;
};
export const AutoRenewCard = ({
	autoRenewEnabled = false,
	onAutoRenewPress,
	isDisabled,
}: Props) => {
	const theme = useUserPreferenceStore((state) => state.theme);
	const {t} = useAppTranslation();
	return (
		<LinearGradient
			colors={[Colors[theme].shadesBlue06, Colors[theme].secondaryWhite]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0.8, y: 1 }}
			className=" rounded-[12px] flex-row px-4 py-3 items-center justify-between overflow-hidden border-t-0 border-b-[1.5px] border-e-[1.5px] border-s-[0.5px] border-shades-blue-06"
			style={{ opacity: isDisabled ? 0.7 : 1 }}
		>
			<GenericImage
				uri={require('../../public/images/setting-bg1.webp')}
				className="absolute end-0 top-4"
				width="w-[58px]"
				height="h-[55px]"
			/>
			<GenericImage
				uri={require('../../public/images/setting-bg2.webp')}
				width="w-[38px]"
				height="h-[36px]"
				resizeMode="contain"
				className="absolute -top-2.5 end-12"
			/>
			<View className="flex-row items-center gap-3">
				<View>
					<View className="flex-row items-center gap-1">
						<CustomText
							fontVarient="bold"
							className="text-secondary-gray text-sm"
						>
							{t('common.substoAutoRenew')}
						</CustomText>
						<Badge
							gradientBadge
							gradientColors={[
								Colors[theme].shadesGreen02,
								Colors[theme].secondaryGreen,
							]}
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 0.5 }}
							locations={[0.1, 1]}
							containerClassName="bg-secondary-green !rounded-full !px-2 !py-0 ms-[6px]"
							textColorClassName="text-secondary-white text-[10px]"
							textFontVariant="bold"
							label={t('label.free')}
						/>
					</View>
					<CustomText
						fontVarient="regular"
						className="text-shades-gray-02 text-xs w-full mt-1 text-start text-left"
					>
						{t('common.renewPackageAuto')}
					</CustomText>
				</View>
			</View>
			<GenericSwitch
				disabled={isDisabled}
				containerClassName="!me-2"
				value={autoRenewEnabled}
				onChange={onAutoRenewPress}
				onColor="bg-secondary-green"
				controlledCommit={true}
			/>
		</LinearGradient>
	);
};

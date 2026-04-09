import { View } from 'react-native';
import { Colors, Themes } from '../configs/themes';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import CustomText from './customText';
import SVGIcon from './svgIcon';

interface InlineMsgProps {
	error: string;
	isInfo?: boolean;
	containerClassName?: string;
}

const InlineMsg: React.FC<InlineMsgProps> = ({
	error,
	isInfo,
	containerClassName,
}) => {
	const { theme } = useUserPreferenceStore();
	return (
		<View
			className={`flex-row items-center gap-2 mt-2 me-1 ${containerClassName ?? ''}`}
		>
			{!!error && (
				<>
					<SVGIcon
						name={'circleExclamationMark'}
						width={14}
						height={14}
						viewBox="0 0 15 14"
						stroke={
							isInfo ? Colors[theme].secondaryBlue : Themes[theme].secondaryRuby
						}
					/>
					<CustomText
						className={`${isInfo ? 'text-shades-gray-02' : 'text-secondary-ruby'} text-xs leading-[1.25]`}
					>
						{error}
					</CustomText>
				</>
			)}
		</View>
	);
};

export default InlineMsg;

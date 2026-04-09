import {
	BottomSheetFooter,
	BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Platform, Pressable, View } from 'react-native';
import { NumberItem } from '../apis/types/netcracker';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { ChooseNewNumberSheetProps } from '../sheets/chooseNewNumberSheet';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { userJourneyStore } from '../stores/userJourneyStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import { isRTL } from '../utils/formatter';
import { closeSheetModal } from '../utils/util';
import Badge from './badge';
import CustomButton from './customButton';
import CustomText from './customText';
import SVGIcon from './svgIcon';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { bottomSheets } from '../configs/bottomSheets';

type PickNumberCardProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	availableNumbers: NumberItem[];
	suggestedNumber?: NumberItem;
	setSuggestedNumber: Dispatch<SetStateAction<NumberItem | undefined>>;
	loadNewNumber: () => void;
};

const PickNewNumberCard: React.FC<PickNumberCardProps> = ({
	accessibilityLabel,
	nativeID = 'pick_new_number',
	availableNumbers,
	suggestedNumber,
	setSuggestedNumber,
	loadNewNumber,
}) => {
	const { fontPrimaryRegular, fontPrimaryBold, fontPrimaryMedium } = constants;
	const { theme } = useUserPreferenceStore();
	const [isNumberPicked, setNumberPicked] = useState(false);
	const { setActiveSheet, activeSheet } = useBottomSheetStore();
	const { setJourneyState } = userJourneyStore();
	const { t } = useAppTranslation();
	console.log('availableNumbers', availableNumbers);

	useEffect(() => {
		if (suggestedNumber) {
			setJourneyState({ selectedNumber: suggestedNumber });
		}
	}, [suggestedNumber, setJourneyState]);

	useEffect(() => {
		if (availableNumbers.length > 0) {
			setSuggestedNumber(availableNumbers?.[0]);
		}
	}, [availableNumbers, setSuggestedNumber]);

	const onPickNumber = useCallback(() => {
		const { bottomSheetOptions } = useBottomSheetStore.getState();
		setSuggestedNumber(bottomSheetOptions.props?.selectedNumber);
		if (bottomSheetOptions.props?.selectedNumber !== undefined) {
			setNumberPicked(true);
		}
		// if (Platform.OS !== 'web') {
		// 	setActiveSheet(null);
		// }
		closeSheetModal();
	}, [setSuggestedNumber]);

	const renderFooter = useCallback(
		(props: BottomSheetFooterProps) => (
			<BottomSheetFooter
				{...props}
				bottomInset={24}
				style={{ marginHorizontal: 20 }}
			>
				<CustomButton
					label={t('button.continue')}
					disabled={availableNumbers?.length === 0}
					onPress={() => {
						onPickNumber();
					}}
				/>
			</BottomSheetFooter>
		),
		[onPickNumber, availableNumbers],
	);

	const openChooseNewNumberSheet = () => {
		setActiveSheet('chooseNewNumberSheet', {
			snapPoints: ['80%'],
			enableDynamicSizing: false,
			title: t('label.selectYourNewNumber'),
			props: {
				numbers: availableNumbers,
				selectedNumber: suggestedNumber,
				onWebContinue: onPickNumber,
				loadNewNumber: loadNewNumber,
			} as ChooseNewNumberSheetProps,
			renderFooter: renderFooter,
		});
	};

	return (
		<View
			className="bg-secondary-white rounded-xl p-4"
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			<View className="flex-row">
				<CustomText
					className={`text-secondary-gray text-base flex-1 ${Platform.OS === 'web' ? 'text-start' : 'text-left'} ${fontPrimaryBold}`}
				>
					{t('label.pickNewNumber')}
				</CustomText>
				{isNumberPicked && (
					<SVGIcon
						name={'tickCircle'}
						width={20}
						height={20}
						viewBox="0 0 20 20"
						pathFill={Colors[theme].secondaryGreen}
					/>
				)}
			</View>
			<View
				className={
					isNumberPicked
						? 'mt-4 rounded-xl'
						: 'border border-shades-gray-06 p-4 mt-4 rounded-xl mb-2'
				}
			>
				<View className={'flex-row items-center'}>
					<View className="gap-2 flex-1">
						<CustomText
							className={`text-shades-gray-02 text-xs ${Platform.OS === 'web' ? 'text-start' : 'text-left'} ${fontPrimaryRegular}`}
						>
							{`${isNumberPicked ? t('label.choosenNumber') : t('label.suggestedNumberForYou')}`}
						</CustomText>
						<CustomText
							className={`text-secondary-gray text-xl ${Platform.OS === 'web' && isRTL() ? 'text-end' : 'text-left'} ${fontPrimaryBold}`}
						>
							{suggestedNumber?.msisdn}
						</CustomText>
					</View>
					{isNumberPicked ? (
						<Pressable onPress={openChooseNewNumberSheet} className="">
							<CustomText
								fontVarient="medium"
								className="text-sm text-secondary-blue"
							>
								{t('button.change')}
							</CustomText>
						</Pressable>
					) : (
						<View>
							<Badge
								textColorClassName="text-secondary-white"
								bgColorClassName="bg-secondary-yellow"
								label={t('label.recommended')}
								containerClassName="!rounded-[8px]"
							/>
						</View>
					)}
				</View>

				{!isNumberPicked && (
					<CustomButton
						containerClassName={'mt-4 !py-2'}
						label={t('button.useThisNumber')}
						onPress={() => setNumberPicked(true)}
						type="outlined"
						labelFontName={fontPrimaryMedium}
					/>
				)}
			</View>
			{!isNumberPicked ? (
				<Pressable
					onPress={openChooseNewNumberSheet}
					className="flex-row gap-2 py-2 px-4 justify-center items-center"
				>
					<SVGIcon name="refresh" height={16} width={16} />
					<CustomText
						fontVarient="medium"
						className="text-sm text-secondary-blue"
					>
						{t('common.chooseDiffNumber')}
					</CustomText>
				</Pressable>
			) : null}
		</View>
	);
};

export default PickNewNumberCard;

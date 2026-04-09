import React, { useState } from 'react';
import { Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NumberItem } from '../apis/types/netcracker';
import Badge from '../components/badge';
// import { NumberItem } from '../apis/types/store';
import CustomButton from '../components/customButton';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import RadioButton from '../components/radioButton';
import SVGIcon from '../components/svgIcon';
import constants from '../configs/constants';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { setAccessibilityProps } from '../types';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

export type ChooseNewNumberSheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	numbers: NumberItem[];
	selectedNumber: NumberItem;
	onWebContinue?: () => void;
	loadNewNumber?: () => void;
};

const ChooseNewNumberSheet: React.FC<ChooseNewNumberSheetProps> = () => {
	const { bottomSheetOptions, updateActiveSheetProps } = useBottomSheetStore();
	const {
		nativeID = 'choose_new_number_sheet',
		accessibilityLabel,
		numbers = [],
		selectedNumber,
		onWebContinue,
		loadNewNumber,
	}: ChooseNewNumberSheetProps = bottomSheetOptions.props;
	const { fontPrimaryMedium, actionOpacity, fontPrimaryRegular } = constants;
	const [selectedVal, setSelectedVal] = useState(selectedNumber);
	const { height } = useWindowDimensions();
	const { t } = useAppTranslation();
	const isRecommended = (index) => index === 0;

	console.log("Called here")

	return (
		<View
			className={'bg-shades-purple-06 pb-8 px-5 web:flex-1'}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>
			{/* <View className="flex-row gap-4 items-center">
			<View className="flex-row gap-4 items-center mt-7">
				{Platform.OS === 'web' && (
					<Pressable
						onPress={() =>
							useBottomSheetStore.getState().setWebModalVisible(false)
						}
						className={`w-10 h-10 items-center justify-center rounded-full bg-black/5 ${actionOpacity} ${animateOpacity}`}
					>
						<View className={`${isRTL() ? 'rotate-180' : ''}`}>
							<SVGIcon
								name={'back'}
								width={24}
								height={24}
								stroke={Colors[theme].black}
							/>
						</View>
					</Pressable>
				)}
				<CustomText
					className={`text-secondary-gray text-xl ${fontPrimaryBold} text-start text-left`}
				>
					{t('label.selectYourNewNumber')}
				</CustomText>
			</View> */}
			<View
			className='bg-secondary-white mt-6 rounded-xl p-4'
				style={{
					// maxHeight: Platform.OS === 'web' ? height * 0.8 : height * 0.7,
					maxHeight: height * 0.60,
				}}
			>
				<BottomSheetFlatList
					data={numbers}
					keyExtractor={(item) => item?.id}
					showsVerticalScrollIndicator={false}
					contentContainerClassName={'p-4 bg-secondary-white mt-6 rounded-xl'}
					ItemSeparatorComponent={() => (
						<Divider containerClassName="my-4 !bg-shades-purple-06" />
					)}
					renderItem={({ item, index }) => (
						<RadioButton
							// label={item.msisdn}
							labelView={
								<View className="flex-row items-center gap-3 flex-1">
									<CustomText
										fontVarient="medium"
										className="text-base text-secondary-gray"
									>
										{item.msisdn}
									</CustomText>
									{isRecommended(index) && (
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
							}
							selected={item.id === selectedVal?.id}
							onPress={() => {
								setSelectedVal(item);
								updateActiveSheetProps({ selectedNumber: item });
							}}
							labelClassName={fontPrimaryRegular}
						/>
					)}
					ListFooterComponent={() => (
						<Pressable
							className={`flex-row pt-4 mb-2 mt-4 justify-center gap-2 ${actionOpacity} border-t border-t-shades-purple-06`}
							onPress={loadNewNumber}
						>
							<SVGIcon
								name={'sync'}
								width={24}
								height={24}
								viewBox="0 0 25 24"
							/>
							<CustomText
								className={`text-base text-secondary-blue ${fontPrimaryMedium}`}
							>
								{t('action.loadNewNumber')}
							</CustomText>
						</Pressable>
					)}
				/>
			</View>
			{/* {Platform.OS === 'web' && (
				<CustomButton
					containerClassName="mt-5 mx-[10%]"
					label={t('button.continue')}
					disabled={selectedVal === undefined}
					onPress={() => {
						useBottomSheetStore.getState().setWebModalVisible(false);
						onWebContinue?.();
					}}
				/>
			)} */}
		</View>
	);
};

export default ChooseNewNumberSheet;

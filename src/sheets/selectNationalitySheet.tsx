import {
	BottomSheetFlatList,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, { useState, useEffect } from 'react';
import {
	ListRenderItem,
	Platform,
	View,
	useWindowDimensions,
} from 'react-native';
import { CountryItem } from '../apis/types/telcoProvision';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import CustomText from '../components/customText';
import Divider from '../components/divider';
import RadioButton from '../components/radioButton';
import SVGIcon from '../components/svgIcon';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useBottomSheetStore } from '../stores/useBottomSheetStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { setAccessibilityProps } from '../types';
import { Language, isRTL } from '../utils/formatter';
import { useAppTranslation } from '../hooks/useAppTranslation';
import GenericInput from '../components/genericInput';
export type SelectNationalitySheetProps = {
	nativeID?: string;
	accessibilityLabel?: string;
	type?: 'PICK_NATIONALITY' | 'PICK_COUNTRY_CODE';
	list: CountryItem[];
	onCountrySelect: (country: CountryItem) => void;
	country: CountryItem;
	onWebContinue?: () => void;
};

const SelectNationalitySheet: React.FC<SelectNationalitySheetProps> = () => {
	const { bottomSheetOptions } = useBottomSheetStore();
	const {
		nativeID = 'select_nationality_sheet',
		accessibilityLabel,
		type = 'PICK_NATIONALITY',
		list,
		country,
		onCountrySelect,
		onWebContinue,
	}: SelectNationalitySheetProps = bottomSheetOptions.props;
	const { fontPrimaryBold, fontPrimaryMedium, fontPrimaryRegular } = constants;
	const isPickNationality = type === 'PICK_NATIONALITY';
	const [searchText, setSearchText] = useState('');
	const { theme, language } = useUserPreferenceStore();
	const [selectedCountry, setSelectedCountry] = useState<CountryItem>(country);
	const { t } = useAppTranslation();
	const { height } = useWindowDimensions();
	const name = language === Language.ar ? 'country_ar' : 'country_en';
	useEffect(() => {
  console.log("Nationality sheet mounted")
  return () => console.log("Nationality sheet unmounted")
}, [])

	const renderItem: ListRenderItem<CountryItem> = ({ item }) => {
		return (
			<RadioButton
				selected={selectedCountry?.id === item.id}
				onPress={() => {
					setSelectedCountry(item);
					onCountrySelect(item);
				}}
				label={isPickNationality ? item?.[name] : ''}
				labelView={
					isPickNationality ? undefined : (
						<View className="flex-row gap-[2px] flex-1">
							<CustomText
								className={`text-sm text-secondary-gray ${fontPrimaryMedium}`}
							>{`${item?.[name]}`}</CustomText>
							<CustomText
								className={`text-sm text-secondary-gray ${fontPrimaryMedium}`}
							>{`[${item.dial_code}]`}</CustomText>
						</View>
					)
				}
				leadingIcon={
					item?.flag_icon
						? item.flag_icon
						: require("../../public/images/placeholder-flag.webp")
				}
				leadingIconWidth={24}
				leadingIconHeight={18}
				leadingIconViewClassName={'!bg-transparent'}
				labelClassName={`!text-sm ${fontPrimaryMedium}`}
			/>
		);
	};

	return (
		<View
			className={'bg-shades-purple-06 pb-8 px-5 flex-1 '}
			{...setAccessibilityProps({ nativeID, accessibilityLabel })}
		>

			<View className="px-4 pb-4 pt-6 bg-secondary-white mt-4 rounded-xl flex-1">
					<GenericInput
						placeholder={t('placeholder.searchCountries')}
						inputClassName={`!ps-5 !pe-5 !py-0 !h-[48px] ${fontPrimaryRegular}`}
						value={searchText}
						onChangeText={setSearchText}
						hideInlineView
						error=""
						shouldValidate={false}
						searchEnabled
						isEmbedded={true}
					/>
				<CustomText
					className={`text-shades-gray-02 text-xs mt-6 ${fontPrimaryBold} text-start text-left`}
				>
					{t('label.countriesList')}
				</CustomText>
				<View className='mt-2' style={{
					maxHeight: height * 0.5,
				}}> 
						<BottomSheetFlatList
							data={list.filter((item) =>
								item?.[name].toLowerCase().includes(searchText.toLowerCase()),
							)}
							keyExtractor={(item) => item.id.toString()}
							ItemSeparatorComponent={() => (
								<Divider containerClassName="my-2" />
							)}
							renderItem={renderItem}
							showsVerticalScrollIndicator={false}
						/>
						</View>
				
			</View>
		</View>
	);
};

export default SelectNationalitySheet;

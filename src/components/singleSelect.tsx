import GenericList, { GenericListProps } from "./scrollableOptionList";
import SelectableOption from "./selectableOption";

interface SingleSelectProps extends Omit<GenericListProps<string>, "children"> {
  selected: string | null | undefined;
  onSelect: (value: string) => void;
  selectedClassName?: string;
  unSelectedClassName?: string;
  selectedTextClassName?: string;
  unSelectedTextClassName?: string;
  textClassName?: string;
  itemClassName?: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  data,
  selected,
  onSelect,
  horizontal,
  itemClassName,
  selectedClassName,
  textClassName,
  selectedTextClassName,
  unSelectedTextClassName,
  unSelectedClassName,
  numColumns = 0,
  containerClassName,
  nativeID = "single_select",
  accessibilityLabel,
  contentContainerClassName = "gap-2",
  columnWrapperClassName,
}) => {
  const renderItem = (item: string) => {
    const isSelected = selected === item;

    return (
      <SelectableOption
        label={item}
        selected={isSelected}
        onPress={() => {
          onSelect(item);
        }}
        containerClassName={itemClassName}
        textClassName={textClassName}
        selectedClassName={selectedClassName}
        unSelectedClassName={unSelectedClassName}
        selectedTextClassName={selectedTextClassName}
        unSelectedTextClassName={unSelectedTextClassName}
      />
    );
  };

  return (
    <GenericList<string>
      numColumns={numColumns}
      data={data}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      containerClassName={containerClassName}
      contentContainerClassName={contentContainerClassName}
      columnWrapperClassName={
        numColumns > 1 ? columnWrapperClassName || "justify-evenly" : undefined
      }
      nativeID={nativeID}
      accessibilityLabel={accessibilityLabel}
      removeClippedSubviews={false}
    >
      {(item) => renderItem(item)}
    </GenericList>
  );
};

export default SingleSelect;

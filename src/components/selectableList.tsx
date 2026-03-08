import { MotiView } from "moti";
import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface BaseSelectableListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  direction?: "row" | "column";
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  className?: string;
  filterDisabled?: (item: T) => boolean;
}
interface MultiSelectProps<T> extends BaseSelectableListProps<T> {
  multiple: true;
  initialSelected?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
}
interface SingleSelectProps<T> extends BaseSelectableListProps<T> {
  multiple?: false;
  initialSelected?: T | null;
  onSelectionChange?: (selectedItem: T | null) => void;
}

export type SelectableListProps<T> = MultiSelectProps<T> | SingleSelectProps<T>;

export function SelectableList<T>({
  data,
  keyExtractor,
  multiple = false,
  direction = "column",
  renderItem,
  onSelectionChange,
  initialSelected = multiple ? [] : null,
  className = "",
  filterDisabled,
}: SelectableListProps<T>) {
  const [selected, setSelected] = useState<T[] | T | null>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const handlePress = (item: T) => {
    if (multiple) {
      const current = selected as T[];
      const exists = current.some(
        (i) => keyExtractor(i) === keyExtractor(item)
      );
      const selectedValue = exists
        ? current.filter((i) => keyExtractor(i) !== keyExtractor(item))
        : [...current, item];
      setSelected(selectedValue);
      onSelectionChange?.(selectedValue as any);
    } else {
      const isSame =
        selected && keyExtractor(selected as T) === keyExtractor(item);
      setSelected(isSame ? null : item);

      onSelectionChange?.(isSame ? null : (item as any));
    }
  };

  const isSelected = (item: T): boolean => {
    if (multiple) {
      return (selected as T[]).some(
        (i) => keyExtractor(i) === keyExtractor(item)
      );
    }

    return selected
      ? keyExtractor(selected as T) === keyExtractor(item)
      : false;
  };

  return (
    <ScrollView
      horizontal={direction === "row"}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      className={`flex ${
        direction === "row" ? "flex-row" : "flex-col"
      } gap-2 ${className}`}
    >
      {data.map((item) => {
        const selected = isSelected(item);
        const isDisabled = filterDisabled?.(item);
        return (
          <TouchableOpacity
            disabled={isDisabled}
            key={keyExtractor(item)}
            activeOpacity={0.8}
            onPress={() => handlePress(item)}
          >
            <MotiView
              from={{ opacity: 0.9 }}
              animate={{
                opacity: selected ? 1 : 0.9,
              }}
              transition={{
                type: "timing",
                duration: 180,
              }}
            >
              {renderItem(item, selected)}
            </MotiView>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

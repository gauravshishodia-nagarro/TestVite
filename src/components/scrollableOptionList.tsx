import React from "react";
import { FlatList, FlatListProps } from "react-native";
import { setAccessibilityProps } from "../types";

export interface GenericListProps<T>
  extends Omit<FlatListProps<T>, "renderItem" | "children"> {
  children?: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
}

const GenericList = <T,>({
  data,
  children,
  containerClassName = "",
  keyExtractor,
  nativeID = "list",
  accessibilityLabel,
  ...rest
}: GenericListProps<T>) => {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor || ((_, index) => index.toString())}
      renderItem={({ item, index }) => <>{children?.(item, index)}</>}
      className={containerClassName}
      {...rest}
      {...setAccessibilityProps({ nativeID, accessibilityLabel, role: "list" })}
    />
  );
};

export default GenericList;

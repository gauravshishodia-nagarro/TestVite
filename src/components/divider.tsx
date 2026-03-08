import { View } from "react-native";

interface DividerProps {
  containerClassName?: string;
}

const Divider: React.FC<DividerProps> = ({ containerClassName }) => {
  return (
    <View className={`h-[1px] bg-shades-purple-06 ${containerClassName}`} />
  );
};

export default Divider;

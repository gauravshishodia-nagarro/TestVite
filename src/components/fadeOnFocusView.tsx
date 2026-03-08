import { useIsFocused } from "@react-navigation/native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

export default function FadeOnFocusView({
  children,
  className,
  duration = 750,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  const isFocused = useIsFocused();

  return (
    <>
      <MotiView
        from={{ opacity: 0.8 }}
        animate={{ opacity: isFocused ? 0 : 0.8 }}
        exit={{ opacity: isFocused ? 0.8 : 0 }}
        transition={{
          type: "timing",
          duration,
          easing: Easing.out(Easing.ease),
          delay: 10,
        }}
        className={`flex-1 bg-shades-purple-06/80 absolute top-0 bottom-0 left-0 right-0 z-50 pointer-events-none ${className}`}
      />

      {children}
    </>
  );
}

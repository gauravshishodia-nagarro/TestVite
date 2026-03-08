import type {
  BottomSheetFooterProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { create } from "zustand";

export type BottomSheetOptions = {
  snapPoints?: (string | number)[];
  index?: number;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  props?: any;
  renderFooter?: React.FC<BottomSheetFooterProps>;
  enableBlurKeyboardOnGesture?: boolean;
};

export type BottomSheetState = {
  activeSheet: React.ReactNode | null;
  bottomSheetOptions: BottomSheetOptions;
  setActiveSheet: (id: string | null, options?: BottomSheetOptions) => void;
  updateActiveSheetProps: (props: any) => void;
  webModalVisible: boolean;
  setWebModalVisible: (visible: boolean) => void;
};

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  activeSheet: null,
  webModalVisible: false,
  bottomSheetOptions: {
    snapPoints: ["25%", "50%", "75%", "100%"],
    index: 0,
    enableDynamicSizing: true,
    keyboardBehavior: "extend",
    props: {},
    renderFooter: undefined,
    enableBlurKeyboardOnGesture: false,
  },
  setActiveSheet: (key, options = {}) => {
    console.log("key", key);
    set((state) => {
      const mergedOptions = {
        ...state.bottomSheetOptions,
        ...options,
        ...(key === null && { enableBlurKeyboardOnGesture: false }),
        ...(key === null && { enableDynamicSizing: true }),
        ...(key === null && { renderFooter: undefined }),
      };
      return {
        activeSheet: key,
        bottomSheetOptions: mergedOptions,
        webModalVisible: key !== null,
      };
    });
  },
  updateActiveSheetProps: (newProps: any) =>
    set((state) => ({
      bottomSheetOptions: {
        ...state.bottomSheetOptions,
        props: {
          ...state.bottomSheetOptions.props,
          ...newProps,
        },
      },
    })),
  setWebModalVisible: (visible: boolean) => set({ webModalVisible: visible }),
}));

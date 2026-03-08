import { create } from "zustand";

type SoftResetState = {
  appKey: number;
  softReset: () => void;
};

export const useSoftResetStore = create<SoftResetState>((set) => ({
  appKey: 0,
  softReset: () =>
    set((state) => ({
      appKey: state.appKey + 1,
    })),
}));

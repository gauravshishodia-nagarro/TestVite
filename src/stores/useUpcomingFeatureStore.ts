import { create } from 'zustand';

type UpcomingFeatureState = {
  visible: boolean;
  show: () => void;
  hide: () => void;
};

export const useUpcomingFeatureStore = create<UpcomingFeatureState>((set) => ({
  visible: false,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));

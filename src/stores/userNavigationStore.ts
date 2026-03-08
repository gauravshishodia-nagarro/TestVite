import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface UserNavigationState {
  hasCompletedLanguageSelection: boolean;
  hasCompletedOnBoarding: boolean;
  setNavigationState: (updates: Partial<UserNavigationState>) => void;
  resetNavigationState: () => void;
  packageTabIndex: number;
}

const initialState: Omit<
  UserNavigationState,
  "setNavigationState" | "resetNavigationState"
> = {
  hasCompletedLanguageSelection: false,
  hasCompletedOnBoarding: false,
  packageTabIndex: 0,
};

export const useUserNavigationStore = create<UserNavigationState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setNavigationState: (updates) =>
          set((state) => ({ ...state, ...updates })),
        resetNavigationState: () => set(initialState),
      }),
      {
        name: "user-navigation-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: "UserNavigationStore" }
  )
);

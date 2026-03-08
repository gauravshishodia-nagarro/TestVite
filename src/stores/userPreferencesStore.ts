import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type UserType = "GUEST" | "TELCO" | "NON_TELCO";
export type Language = "ar" | "en";
type Theme = "light" | "dark";
type LoginMethod = "email" | "phone" | "nationalid" | null;
export type LoginCredentialType =
  | "id"
  | "phoneNumber"
  | "email"
  | "email_single_login"
  | "login_by_verification_questions";

interface UserPreferenceState {
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
  fcmToken: string | null;
  loginMethod: LoginMethod;
  name: string | null;
  phoneNumber: string | null;
  emailId: string | null;
  accessToken: string | null;
  userId: string | null;
  updateUserPreferences: (preferences: Partial<UserPreferenceState>) => void;
  userType?: UserType | null;
  resetUserPreferences: () => void;
  isMultilineLogin: boolean;
}

const initialState: Omit<
  UserPreferenceState,
  "updateUserPreferences" | "resetUserPreferences"
> = {
  theme: "light",
  language: "en",
  notificationsEnabled: true,
  fcmToken: null,
  loginMethod: null,
  name: null,
  emailId: null,
  phoneNumber: null,
  userId: null,
  accessToken: null,
  userType: null,
  isMultilineLogin: false,
};

export const useUserPreferenceStore = create<UserPreferenceState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        updateUserPreferences: (preferences) =>
          set((state) => ({ ...state, ...preferences })),
        resetUserPreferences: () =>
          set({
            loginMethod: null,
            name: null,
            emailId: null,
            phoneNumber: null,
            userId: null,
            accessToken: null,
            userType: null,
            isMultilineLogin: false,
          }),
      }),
      {
        name: "user-preference-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: "UserPreferenceStore" }
  )
);

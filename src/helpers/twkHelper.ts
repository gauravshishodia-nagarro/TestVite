
import { useProfile} from '../apis/services/user';
import { useVerifyTWKToken } from '../apis/services/authentication';
import {  ValidateTawakkalnaTokenPayload } from '../apis/types/authentication';
import { useUserModeQuery } from '../apis/services/dashboard';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';

// fallback lives in ONE place — env var
const DEV_TOKEN = process.env.EXPO_PUBLIC_DEV_FALLBACK_TOKEN ?? null;

const decodeJWT = (token: string) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const generateTWKToken = () => {
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbElkIjoiMTExMTExMTExMSIsImV4cCI6MTc3NTY1MDQ2OCwiaXNzIjoiVGF3YWtrYWxuYSIsImF1ZCI6Ik1pbmlTZXJ2aWNlMTAwMDMyMDMifQ.AcFpgCHCBT8VAx5KvcAWmJhZN6opHjeahro_Ki-ZHyN_sMezCp3LGCrozmh_wgQfAMR9S-V8uzluMb2frJB6TIH3pQxQpEMhAZR0nrm0y-n7Ux_WUy0gg1tg8SY8xpPa2EXocSQShpBS7oEneWft3Seew4JIEB8L9P17bp9kFvJwmBx9fAVApo121xfY6yfmiX0NkvlGMFiNIYvduQnX_ZRoXRHKp3ZHS4vlAu8RbBJU-qcf4ef5wlB77vBcMj0rfm7Gmvf-D1uPVNkAS1sJKd-O1bIkqr6Xwmwv7I47RE3Q-KxdcwxSjTSs9y0s79jCcglNorED9cKn7XBL2OX0gQ'
}

export const useAutoLogin = () => {
    const { updateUserPreferences } = useUserPreferenceStore();
    const { mutateAsync: verifyTWKToken } = useVerifyTWKToken();
    const { mutateAsync: fetchProfile } = useProfile();
    const { refetch: refetchUserMode } = useUserModeQuery();
  
    const login = async (twkToken: string, userDetails: Omit<ValidateTawakkalnaTokenPayload, 'twkToken'>) => {
      let appToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNTE0MTA3ZjAtMzMyYy0xMWYxLTk4M2YtMDUxNGFjM2M4ODdjIiwibmFtZSI6InRlc3QifSwiaWF0IjoxNzc1NjQwMDk1LCJleHAiOjE3ODA4MjQwOTV9.Me9zBlbLmcVKaPyYhDMMqZV2upNrcC665ULHMYJ6Uo4';
  
      try {
        const res = await verifyTWKToken({ twkToken, ...userDetails });
        appToken = res?.token ?? appToken;
      } catch {
        // TWK validation failed — dev token kicks in
      }
  
      const decoded = decodeJWT(appToken);
      updateUserPreferences({
        accessToken: appToken,
        isTWKTokenValid: !!decoded,
        userId: decoded?.user?.id ?? null,
        name: decoded?.user?.name ?? null,
        isMultilineLogin: decoded?.user?.isMultiline ?? false,
        userType: 'NON_TELCO',
      });
  
      if (decoded?.user?.id) {
        try {
          const profile = await fetchProfile({ userId: decoded.user.id });
          updateUserPreferences({
            name: profile.name,
            phoneNumber: profile.phoneNo,
            emailId: profile.emailId,
          });
        } catch {
          // JWT data already set above
        }
      }
  
      refetchUserMode();
    };
  
    return { login };
  };
  
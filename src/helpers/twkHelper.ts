
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
        return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbElkIjoiMTExMTExMTExMSIsImV4cCI6MTc3NjY3MzkxMiwiaXNzIjoiVGF3YWtrYWxuYSIsImF1ZCI6Ik1pbmlTZXJ2aWNlMTAwMDMyMDMifQ.cVN3eRPov5Mf__zNerKDYbZFo_aGaJ5qqTxRMcRE0SVqELt7YJDDWt2leaqXkVil8ZKEZ1AcARVF_rXcZ40lxpSdFrs2ND3Ff5my0WpeEp354YCeceYitBbSp19N0gCQ6FZJpuInB0q53aS8aDEPRtXPUFU-hMtn8rUzsWJwJkIkxAt7oKTKrjpuGBVVAO3f9nKO0-yzYWpVOwyRqLQQKhLBCIDzi922PbBl2sScHc-HuFTVCwkfsm3jzPs2adRaiCSlVisoi7VQjvhWc3PKt5CzDUd-gJu9Tv4zCXgqFp5tjfX9LVMJ7cSNh_wuDR2RZ2IcetXl2RNhlk2PeOkHEw'

}

export const useAutoLogin = () => {
    const { updateUserPreferences } = useUserPreferenceStore();
    const { mutateAsync: verifyTWKToken } = useVerifyTWKToken();
    const { mutateAsync: fetchProfile } = useProfile();
    const { refetch: refetchUserMode } = useUserModeQuery();
  
    const login = async (twkToken: string, userDetails: Omit<ValidateTawakkalnaTokenPayload, 'twkToken'>) => {
      let appToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiY2NhNTk2MDAtMzhjNi0xMWYxLTg2NmQtMTNiYzhiY2FjZGJlIiwibmFtZSI6InNkZmRzZmRzZmRzZiJ9LCJpYXQiOjE3NzYyNTYxOTMsImV4cCI6MTc4MTQ0MDE5M30.yFfhs9xVhu_en8jT_CrulKFQbI-13kS067MLx42mPNQ';
      // let appToken = '';
  
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
  
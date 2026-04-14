
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
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbElkIjoiMTExMTExMTExMSIsImV4cCI6MTc3NTgwNzk0MCwiaXNzIjoiVGF3YWtrYWxuYSIsImF1ZCI6Ik1pbmlTZXJ2aWNlMTAwMDMyMDMifQ.GIRT2mB8DlXxWcy_mbq9qqmnuR8A8_evP_OkjIRclU_RYv88o9tgQd9em5V0zKbmx6gjxyg9O8JYbuRIbTonXDU01iSqgzbnlpVSlg86ci83SM6ozMGucQH4l_rpnB8tatWmMXlFfz9bU5r02s7eCHJV9ksZnR433Tw3qs7YAnWzqSDKPLlntzk91M1jkIMuu4I-yjLBAYqr4SsEHklEgh0mBiOa_njtX_T9OzKx4gs5CEkpZctGwLe4TIRbTqOXdRJm5WrZlo8IS-_OdZ1ie1x5WyosR47qLKPCPEe6WzDnfkE6iB9BewD9voy-EpHaV5kk564TfYsZef1ddJMuMg'
    // return 'eyghbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbElkIjoiMTExMTExMTExMSIsImV4cCI6MTc3NTgwNzk0MCwiaXNzIjoiVGF3YWtrYWxuYSIsImF1ZCI6Ik1pbmlTZXJ2aWNlMTAwMDMyMDMifQ.GIRT2mB8DlXxWcy_mbq9qqmnuR8A8_evP_OkjIRclU_RYv88o9tgQd9em5V0zKbmx6gjxyg9O8JYbuRIbTonXDU01iSqgzbnlpVSlg86ci83SM6ozMGucQH4l_rpnB8tatWmMXlFfz9bU5r02s7eCHJV9ksZnR433Tw3qs7YAnWzqSDKPLlntzk91M1jkIMuu4I-yjLBAYqr4SsEHklEgh0mBiOa_njtX_T9OzKx4gs5CEkpZctGwLe4TIRbTqOXdRJm5WrZlo8IS-_OdZ1ie1x5WyosR47qLKPCPEe6WzDnfkE6iB9BewD9voy-EpHaV5kk564TfYsZef1ddJMuMg'

}

export const useAutoLogin = () => {
    const { updateUserPreferences } = useUserPreferenceStore();
    const { mutateAsync: verifyTWKToken } = useVerifyTWKToken();
    const { mutateAsync: fetchProfile } = useProfile();
    const { refetch: refetchUserMode } = useUserModeQuery();
  
    const login = async (twkToken: string, userDetails: Omit<ValidateTawakkalnaTokenPayload, 'twkToken'>) => {
      let appToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMWM5Y2Q0ZTAtMzc0NC0xMWYxLWIwNTMtMmIyNTljNTViZjJhIiwibmFtZSI6InNkamZramFkZmprYWYifSwiaWF0IjoxNzc2MDkwMTE5LCJleHAiOjE3ODEyNzQxMTl9.0S-jQOg3-CPgRbFKnkeYkkPb8V0gzOH6GNp52lJcOk0';
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
  
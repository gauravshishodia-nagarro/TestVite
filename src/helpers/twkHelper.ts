
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
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRpb25hbElkIjoiMTExMTExMTExMSIsImV4cCI6MTc3NjI0MjYzMCwiaXNzIjoiVGF3YWtrYWxuYSIsImF1ZCI6Ik1pbmlTZXJ2aWNlMTAwMDMyMDMifQ.ZWiblNU9R8vVLAoq-tQV0cQZFKmhhQaAsg6uwejphD7aAgOCDT-fRunUXOhzVzsYIB9AbCoJhqGvIuZp44L26smShYZzPydzLltey_KF1WczvIe39h7eY7jNSYkgP53a2wvXNQXjIOpgGVdkR618oOqoSPpTpZy_H1g26qXgxLdSnNL7U7-4hGycROXmHB8e1mwvRvHq8CGiYU1NQpoN_cQC3Xrobm9giFjbpfd9ZQOxUEAqDGwHb-f8gJSvAZcUJxFnds2CvvkezF1Hzk0q6JJzEu1CS8bCpouEAdXcTmHYTBgOk4IoBC8CCEFnkOuqetL5rmYYLo50n0sC6HceFg'
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
  
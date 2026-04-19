import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import CustomButton from './customButton';
import CustomText from './customText';
import GenericImage from './image';
import SVGIcon from './svgIcon';
import constants from '../configs/constants';
import { Colors } from '../configs/themes';
import { useUpcomingFeatureStore } from '../stores/useUpcomingFeatureStore';
import { useUserPreferenceStore } from '../stores/userPreferencesStore';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { isRTL } from '../utils/formatter';

const UpcomingFeatureOverlay: React.FC = () => {
  const { visible, hide } = useUpcomingFeatureStore();
  const { theme } = useUserPreferenceStore();
  const { actionOpacity, animateOpacity, fontPrimaryBold, fontPrimaryRegular } = constants;
  const { t } = useAppTranslation();
  const navigation = useNavigation();

  const handleBackToHome = () => {
    hide();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'tabs' }] }),
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          style={StyleSheet.absoluteFill}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 250 }}
        >
          {/* Grainy frosted background */}
          {/* Base white layer */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(245,245,250,0.72)' }]} />
          {/* Web: real CSS backdrop blur */}
          {Platform.OS === 'web' && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  // @ts-ignore — web-only CSS property
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  backgroundColor: 'rgba(255,255,255,0.55)',
                },
              ]}
            />
          )}
          {/* Native: stacked layers to simulate depth + grain */}
          {Platform.OS !== 'web' && (
            <>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.45)' }]} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(230,228,240,0.30)' }]} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.20)', opacity: 0.6 }]} />
            </>
          )}

          {/* Back button */}
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ delay: 80, type: 'timing', duration: 200 }}
          >
            <Pressable
              onPress={hide}
              className={`w-[40px] h-[40px] ms-5 mt-5 items-center justify-center rounded-full bg-white/80 border border-shades-gray-06 ${actionOpacity} ${animateOpacity}`}
            >
              <View className={isRTL() ? 'rotate-180' : ''}>
                <SVGIcon name="back" width={24} height={24} stroke={Colors[theme].secondaryGray} />
              </View>
            </Pressable>
          </MotiView>

          {/* Center content */}
          <MotiView
            className="flex-1 justify-center items-center px-6"
            from={{ opacity: 0, translateY: 30, scale: 0.96 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18, mass: 0.9 }}
          >
            <View className="w-[180px] h-[180px] rounded-full bg-white items-center justify-center mb-8 shadow-sm">
              <GenericImage
                uri={require('../../public/images/upcoming-feature.webp')}
                width="w-full"
                height="h-full"
                resizeMode="contain"
              />
            </View>

            <CustomText
              fontVarient="bold"
              className={`text-[20px] text-secondary-gray text-center ${fontPrimaryBold}`}
            >
              {t('label.downloadAppToUseFeature')}
            </CustomText>

            <CustomText
              fontVarient="regular"
              className={`text-sm text-shades-gray-02 text-center mt-1 ${fontPrimaryRegular}`}
            >
              {t('label.downloadAppSubtitle')}
            </CustomText>
          </MotiView>

          {/* Bottom CTA */}
          <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 40 }}
            transition={{ delay: 150, type: 'timing', duration: 220 }}
            className="pb-10 mx-5"
          >
            <CustomButton
              type="outlined"
              label={t('button.backToHome')}
              containerClassName="!bg-transparent border border-secondary-gray rounded-full"
              onPress={handleBackToHome}
            />
          </MotiView>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default UpcomingFeatureOverlay;

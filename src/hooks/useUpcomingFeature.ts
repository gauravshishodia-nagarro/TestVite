import { useUpcomingFeatureStore } from '../stores/useUpcomingFeatureStore';

export const useUpcomingFeature = () => {
  const { show, hide } = useUpcomingFeatureStore();
  return {
    showUpcomingFeature: show,
    hideUpcomingFeature: hide,
  };
};

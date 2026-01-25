import { View, ViewExperience } from '@headless-adminapp/core/experience/view';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

export function useExperienceView(
  logicalName: string,
  viewId?: string,
  associated?: boolean,
  viewIds?: string[],
  view?: ViewExperience<any>,
) {
  const experienceStore = useExperienceStore();

  const { data, isPending } = useQuery({
    queryKey: [
      'experience-schema-view',
      logicalName,
      viewId,
      associated,
      viewIds,
      view,
    ],
    queryFn: async () => {
      if (view) {
        return {
          id: '__custom-view__',
          name: 'Custom View',
          experience: view,
          logicalName: logicalName,
        } as View;
      }

      if (associated) {
        return experienceStore.getAssociatedView(logicalName, viewId, viewIds);
      }

      return experienceStore.getPublicView(logicalName, viewId, viewIds);
    },

    placeholderData: keepPreviousData,
  });

  return {
    view: data,
    isLoadingView: isPending,
  };
}

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

export function useExperienceView(
  logicalName: string,
  viewId?: string,
  associated?: boolean,
  viewIds?: string[]
) {
  const experienceStore = useExperienceStore();

  const { data, isPending } = useQuery({
    queryKey: [
      'experience-schema-view',
      logicalName,
      viewId,
      associated,
      viewIds,
    ],
    queryFn: async () => {
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

import { useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

/** @todo move in different dir */
export function useExperienceViewLookup(
  logicalName: string,
  associated?: boolean,
  viewIds?: string[]
) {
  const experienceStore = useExperienceStore();

  const { data: viewLookup } = useQuery({
    queryKey: [
      'experience-schema-view-lookup',
      logicalName,
      associated,
      viewIds,
    ],
    queryFn: async () => {
      if (associated) {
        return experienceStore.getAssociatedViewLookup(logicalName, viewIds);
      }

      return experienceStore.getPublicViewLookup(logicalName, viewIds);
    },
    initialData: [],
  });

  return {
    viewLookup,
  };
}

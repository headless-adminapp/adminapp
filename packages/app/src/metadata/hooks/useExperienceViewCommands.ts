import { useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

/** @todo move in different dir */
export function useExperienceViewCommands(logicalName: string) {
  const experienceStore = useExperienceStore();

  const { data: commands } = useQuery({
    queryKey: ['experience-schema-view-commands', logicalName],
    queryFn: async () => {
      return experienceStore.getViewCommands(logicalName);
    },
    initialData: [],
  });

  return {
    commands,
  };
}

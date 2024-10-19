import { useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

/** @todo move in different dir */
export function useExperienceViewSubgridCommands(logicalName: string) {
  const experienceStore = useExperienceStore();

  const { data: commands } = useQuery({
    queryKey: ['experience-schema-view-subgrid-commands', logicalName],
    queryFn: async () => {
      return experienceStore.getSubgridCommands(logicalName);
    },
    initialData: [],
  });

  return {
    commands,
  };
}

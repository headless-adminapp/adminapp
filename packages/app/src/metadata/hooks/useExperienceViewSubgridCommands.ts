import { useAppContext } from '@headless-adminapp/app/app';
import { useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

/** @todo move in different dir */
export function useExperienceViewSubgridCommands(logicalName: string) {
  const experienceStore = useExperienceStore();
  const {
    app: { subgridCommands },
  } = useAppContext();

  const { data: commands } = useQuery({
    queryKey: ['experience-schema-view-subgrid-commands', logicalName],
    queryFn: async () => {
      let commands = await experienceStore.getSubgridCommands(logicalName);

      if (!commands) {
        commands = subgridCommands;
      }

      return commands ?? [];
    },
    initialData: [],
  });

  return {
    commands,
  };
}

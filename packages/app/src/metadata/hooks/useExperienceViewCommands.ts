import { useAppContext } from '@headless-adminapp/app/app';
import { useQuery } from '@tanstack/react-query';

import { useExperienceStore } from './useExperienceStore';

/** @todo move in different dir */
export function useExperienceViewCommands(logicalName: string) {
  const experienceStore = useExperienceStore();
  const {
    appExperience: { viewCommands },
  } = useAppContext();

  const { data: commands } = useQuery({
    queryKey: ['experience-schema-view-commands', logicalName],
    queryFn: async () => {
      let commands = await experienceStore.getViewCommands(logicalName);

      if (!commands) {
        commands = viewCommands;
      }

      return commands ?? [];
    },
    initialData: [],
  });

  return {
    commands,
  };
}

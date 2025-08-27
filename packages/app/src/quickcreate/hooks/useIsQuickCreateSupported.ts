import { useExperienceStore } from '@headless-adminapp/app/metadata';
import { useQuery } from '@tanstack/react-query';

export function useIsQuickCreateSupported(logicalName: string) {
  const experienceStore = useExperienceStore();
  const { data: isSupported } = useQuery<boolean>({
    queryKey: ['experience-schema-quick-create-form-supported', logicalName],
    queryFn: async () => {
      return experienceStore.getIsQuickCreateSupported(logicalName);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return isSupported;
}

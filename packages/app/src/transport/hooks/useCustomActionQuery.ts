import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { useDataService } from './useDataService';

export function useCustomActionQuery<T = unknown>(
  actionName: string,
  payload: unknown,
): UseQueryResult<T, Error> {
  const dataService = useDataService();

  return useQuery<T>({
    queryKey: ['data', 'customAction', actionName, payload],
    queryFn: async () => {
      return dataService.customAction(actionName, payload);
    },
  });
}

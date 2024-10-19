import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useDataGridSchema } from './useGridSchema';

export function useGridRefresh() {
  const queryClient = useQueryClient();
  const schema = useDataGridSchema();

  const refresh = useCallback(() => {
    queryClient
      .resetQueries({
        queryKey: ['data', 'retriveRecords', schema.logicalName],
      })
      .catch(console.error);
  }, [queryClient, schema.logicalName]);

  return refresh;
}

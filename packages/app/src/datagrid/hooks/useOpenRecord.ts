import { useRecordSetSetter } from '@headless-adminapp/app/recordset';
import { useRouter, useRouteResolver } from '@headless-adminapp/app/route';
import { PageType } from '@headless-adminapp/core/experience/app';
import { useCallback, useRef } from 'react';

import { useGridData } from './useGridData';
import { useDataGridSchema } from './useGridSchema';

export function useOpenRecord() {
  const data = useGridData();
  const schema = useDataGridSchema();
  const routeResolver = useRouteResolver();
  const router = useRouter();
  const recordSetSetter = useRecordSetSetter();

  const dataRef = useRef(data);
  dataRef.current = data;

  return useCallback(
    (id: string, logicalName: string) => {
      const path = routeResolver({
        logicalName: logicalName,
        type: PageType.EntityForm,
        id,
      });

      if (logicalName === schema.logicalName) {
        recordSetSetter(
          schema.logicalName,
          dataRef.current?.records.map(
            (x) => x[schema.idAttribute] as string
          ) ?? []
        );
      }
      router.push(path);
    },
    [
      recordSetSetter,
      routeResolver,
      router,
      schema.idAttribute,
      schema.logicalName,
    ]
  );
}

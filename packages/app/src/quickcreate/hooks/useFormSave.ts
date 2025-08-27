import { DataLookup, Id } from '@headless-adminapp/core/attributes';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  DataFormContext,
  useDataFormSchema,
  useSelectedForm,
} from '../../dataform';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSelector } from '../../mutable/context';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { useDataService } from '../../transport';

export function useFormSave() {
  const form = useSelectedForm();
  const formInstance = useFormContext();
  const { schemaStore } = useMetadata();
  const schema = useDataFormSchema();
  const initialValues = useContextSelector(
    DataFormContext,
    (state) => state.initialValues
  );
  const dataService = useDataService();
  const openToastNotification = useOpenToastNotification();

  const saveRecord = useContextSelector(
    DataFormContext,
    (state) => state.saveRecordFn
  );

  const client = useQueryClient();

  const _save = async (): Promise<DataLookup<Id> | null> => {
    let saveResult: DataLookup<Id> | null = null;
    await formInstance.handleSubmit(async (values) => {
      const result = await saveRecord({
        values,
        form: form,
        record: undefined,
        initialValues: initialValues,
        dataService,
        schema: schema,
        schemaStore,
      });

      if (!result.success) {
        openToastNotification({
          type: result.isError ? 'error' : 'info',
          title: 'Error',
          text: result.message,
        });
        return;
      }

      await client.invalidateQueries({
        queryKey: ['data', 'retriveRecords', schema.logicalName],
      });

      const record = await dataService.retriveRecord(
        schema.logicalName,
        result.recordId,
        [
          schema.idAttribute,
          schema.primaryAttribute,
          schema.avatarAttribute,
        ].filter(Boolean) as string[]
      );

      saveResult = {
        id: record[schema.idAttribute] as Id,
        name: record[schema.primaryAttribute] as string,
        avatar: schema.avatarAttribute
          ? (record[schema.avatarAttribute] as string)
          : undefined,
      };
    })();

    return saveResult;
  };

  const _saveRef = useRef(_save);
  _saveRef.current = _save;

  const save = useCallback(() => _saveRef.current(), [_saveRef]);

  return save;
}

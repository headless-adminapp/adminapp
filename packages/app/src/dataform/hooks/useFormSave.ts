// Steps
// 1. Show the loading indicator
// 2. Extract modified fields from the form
// 3. Preapre operations
// 4. Perform the operations
// 5. Handle the response (success or error, navigation, clear some cache, etc)
// 6. Hide the loading indicator

// Wrapper - Loader, response message
// Core - Extract modified fields, prepare operations, perform operations

import { SaveMode } from '@headless-adminapp/core/experience/form';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSelector } from '../../mutable/context';
import { useProgressIndicator } from '../../progress-indicator/hooks/useProgressIndicator';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { useDataService } from '../../transport';
import { DataFormContext } from '../context';
import { saveRecord } from '../utils';
import { useFormRecord } from './useFormRecord';
import { useDataFormSchema } from './useFormSchema';
import { useSelectedForm } from './useSelectedForm';

export function useFormSave() {
  const form = useSelectedForm();
  const formInstance = useFormContext();
  const record = useFormRecord();
  const { getSchema } = useMetadata();
  const schema = useDataFormSchema();
  const initialValues = useContextSelector(
    DataFormContext,
    (state) => state.initialValues
  );
  const refresh = useContextSelector(DataFormContext, (state) => state.refresh);
  const dataService = useDataService();
  const { showProgressIndicator, hideProgressIndicator } =
    useProgressIndicator();
  const openToastNotification = useOpenToastNotification();

  const client = useQueryClient();

  function showMessageAfterSave({ isCreatedMode }: { isCreatedMode: boolean }) {
    // Show notification
    if (!isCreatedMode) {
      openToastNotification({
        type: 'success',
        title: 'Record updated',
        text: 'Record updated successfully',
      });
    } else {
      openToastNotification({
        type: 'success',
        title: 'Record created',
        text: 'Record created successfully',
      });
    }
  }

  const _save = async (mode?: SaveMode) => {
    await formInstance.handleSubmit(async (values) => {
      if (mode === 'background' && !record) {
        // Background save should not be triggered if there is no record
        return;
      }

      if (mode !== 'background') {
        showProgressIndicator(undefined, 500);
      }

      try {
        const result = await saveRecord({
          values,
          form: form,
          record: record,
          initialValues: initialValues,
          dataService,
          schema: schema,
          getSchema,
        });

        if (!result.success) {
          openToastNotification({
            type: result.isError ? 'error' : 'info',
            title: 'Error',
            text: result.message,
          });
          return;
        }

        // invalidateQueriesAfterSave({
        //   client,
        // });

        if (mode === 'save' && record) {
          await refresh();
          // client.invalidateQueries({ queryKey: ['data', 'retriveRecord'] });
        } else {
          await client.invalidateQueries({
            queryKey: ['data', 'retriveRecord'],
          });
        }

        await client.invalidateQueries({
          queryKey: ['data', 'retriveRecords'],
        });

        // redirectAfterSave({
        //   navigation,
        //   isCreatedMode: !context.state.record,
        //   recordId: result.recordId,
        //   reset: form.reset,
        //   logicalName: schema.logicalName,
        //   mode,
        // });

        showMessageAfterSave({
          isCreatedMode: !record,
        });
      } catch (err) {
        openToastNotification({
          type: 'error',
          title: 'Error',
          text: (err as Error).message,
        });
      } finally {
        if (mode !== 'background') {
          // Hide the loading indicator
          hideProgressIndicator();
        }
      }
    })();
  };

  const _saveRef = useRef(_save);
  _saveRef.current = _save;

  const save = useCallback(
    (mode?: SaveMode) => _saveRef.current(mode),
    [_saveRef]
  );

  return save;
}

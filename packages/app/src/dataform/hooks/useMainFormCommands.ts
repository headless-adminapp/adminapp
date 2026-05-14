import { useRouter } from '@headless-adminapp/app/route';
import type { EntityFormCommandContext } from '@headless-adminapp/core/experience/form';
import { useCallback } from 'react';

import {
  type CommandItemState,
  useBaseCommandHandlerContext,
  useCommands,
} from '../../command';
import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';
import { useFormInstance } from './useFormInstance';
import { useFormIsReadonly } from './useFormIsReadonly';
import { useFormRecord } from './useFormRecord';
import { useFormSave } from './useFormSave';
import { useDataFormSchema } from './useFormSchema';
import { useRecordId } from './useRecordId';

export function useFormControlContext(): EntityFormCommandContext['primaryControl'] {
  const schema = useDataFormSchema();
  const form = useContextSelector(DataFormContext, (state) => state.form);
  const originalData = useFormRecord();
  const recordId = useRecordId<string | number>();

  const save = useFormSave();
  const refresh = useContextSelector(DataFormContext, (state) => state.refresh);

  const formInstance = useFormInstance();
  const readonly = useFormIsReadonly() ?? false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = formInstance.watch() as any;
  const router = useRouter();

  const close = useCallback(() => {
    void router.back();
  }, [router]);

  return {
    data,
    logicalName: schema.logicalName,
    schema,
    form,
    formId: form.id,
    originalData: originalData ?? null,
    recordId,
    refresh,
    save,
    readonly,
    close,
  };
}

export function useMainFormCommandHandlerContext(): EntityFormCommandContext {
  const primaryControl = useFormControlContext();

  const baseHandlerContext = useBaseCommandHandlerContext();

  return {
    ...baseHandlerContext,
    primaryControl,
  };
}

export function useMainFormCommands(): CommandItemState[][] {
  const commands = useContextSelector(
    DataFormContext,
    (state) => state.commands,
  );

  const handlerContext = useMainFormCommandHandlerContext();

  return useCommands<EntityFormCommandContext>(commands, handlerContext);
}

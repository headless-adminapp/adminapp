import { EntityFormCommandContext } from '@headless-adminapp/core/experience/form';

import {
  CommandItemState,
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

export function useFormControlContext() {
  const schema = useDataFormSchema();
  const form = useContextSelector(DataFormContext, (state) => state.form);
  const originalData = useFormRecord();
  const recordId = useRecordId<string | number>();

  const save = useFormSave();
  const refresh = useContextSelector(DataFormContext, (state) => state.refresh);

  const formInstance = useFormInstance();
  const readonly = useFormIsReadonly();

  const data = formInstance.watch() as any;

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
  };
}

export function useMainFormCommandHandlerContext(): EntityFormCommandContext {
  const primaryControl: any = useFormControlContext();

  const baseHandlerContext = useBaseCommandHandlerContext();

  return {
    ...baseHandlerContext,
    primaryControl,
  };
}

export function useMainFormCommands(): CommandItemState[][] {
  const commands = useContextSelector(
    DataFormContext,
    (state) => state.commands
  );

  const handlerContext = useMainFormCommandHandlerContext();

  return useCommands<EntityFormCommandContext>(commands, handlerContext);
}

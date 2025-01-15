import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command';
import { ProcessFlowInfoContext } from '@headless-adminapp/core/experience/form/ProcessFlowInfo';

import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';
import { useFormInstance } from './useFormInstance';
import { useFormIsReadonly } from './useFormIsReadonly';
import { useFormRecord } from './useFormRecord';
import { useDataFormSchema } from './useFormSchema';
import { useRecordId } from './useRecordId';
import { useSelectedForm } from './useSelectedForm';

function useFormControlContext(): ProcessFlowInfoContext['primaryControl'] {
  const schema = useDataFormSchema();
  const form = useContextSelector(DataFormContext, (state) => state.form);
  const originalData = useFormRecord();
  const recordId = useRecordId<string | number>();

  const formInstance = useFormInstance();
  const readonly = useFormIsReadonly() ?? false;

  const data = formInstance.watch() as any;

  return {
    data,
    logicalName: schema.logicalName,
    schema,
    form,
    formId: form.id,
    originalData: originalData ?? null,
    recordId,
    readonly,
  };
}

function useProcessFlowInfoContext(): ProcessFlowInfoContext {
  const primaryControl = useFormControlContext();

  const baseHandlerContext = useBaseCommandHandlerContext();

  return {
    ...baseHandlerContext,
    primaryControl,
  };
}
export function useProcessFlowSteps() {
  const formConfig = useSelectedForm();
  const context = useProcessFlowInfoContext();

  const steps = formConfig.experience.processFlow?.getSteps(context);

  return steps;
}

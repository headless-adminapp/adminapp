import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command';
import type { ProcessFlowInfoContext } from '@headless-adminapp/core/experience/form/ProcessFlowInfo';
import { useWatch } from 'react-hook-form';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useWatch({ control: formInstance.control }) as any;

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

import { useFormInstance } from './useFormInstance';
import { useDataFormSchema } from './useFormSchema';
import { useRecordId } from './useRecordId';

export function useRecordTitle() {
  const formInstance = useFormInstance();
  const schema = useDataFormSchema();
  const recordId = useRecordId();

  const primaryAttributeValue =
    (formInstance.watch(schema.primaryAttribute) as string) ?? '';

  if (primaryAttributeValue) {
    return primaryAttributeValue;
  }

  if (recordId) {
    return '(No name)';
  }

  return `New ${schema.label.toLowerCase()}`;
}

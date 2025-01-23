import { useFormInstance } from './useFormInstance';
import { useDataFormSchema } from './useFormSchema';
import { useRecordId } from './useRecordId';

export function useRecordTitle() {
  const formInstance = useFormInstance();
  const schema = useDataFormSchema();
  const recordId = useRecordId();

  let primaryAttributeValue = formInstance.watch(schema.primaryAttribute);

  const primaryAttribute = schema.attributes[schema.primaryAttribute];

  if (primaryAttribute?.type === 'lookup') {
    // Handle lookup attribute as primary
    primaryAttributeValue = primaryAttributeValue?.name;
  }

  if (primaryAttributeValue && typeof primaryAttributeValue !== 'string') {
    return String(primaryAttributeValue);
  }

  if (primaryAttributeValue) {
    return primaryAttributeValue;
  }

  if (recordId) {
    return '(No name)';
  }

  return `New ${schema.label.toLowerCase()}`;
}

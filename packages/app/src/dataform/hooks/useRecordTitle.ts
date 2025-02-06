import { useFormInstance } from './useFormInstance';
import { useDataFormSchema } from './useFormSchema';
import { useRecordId } from './useRecordId';

type UseRecordTitleResult = [string, boolean];

export function useRecordTitle(): UseRecordTitleResult {
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
    return [String(primaryAttributeValue), false];
  }

  if (primaryAttributeValue) {
    return [primaryAttributeValue, false];
  }

  if (recordId) {
    return ['(No name)', true];
  }

  return [`New ${schema.label.toLowerCase()}`, true];
}

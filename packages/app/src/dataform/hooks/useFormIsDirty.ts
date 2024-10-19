import { useFormInstance } from './useFormInstance';

export function useFormIsDirty() {
  const formInstance = useFormInstance();

  return Object.keys(formInstance.formState.dirtyFields).length > 0;
}

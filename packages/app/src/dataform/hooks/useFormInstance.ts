import { useFormContext } from 'react-hook-form';

export function useFormInstance() {
  const formInstance = useFormContext();
  return formInstance;
}

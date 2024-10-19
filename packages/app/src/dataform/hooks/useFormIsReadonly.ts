import { useContextSelector } from '../../mutable';
import { DataFormContext } from '../context';

export function useFormIsReadonly() {
  const readonly = useContextSelector(
    DataFormContext,
    (state) => state.isReadonly
  );

  return readonly;
}

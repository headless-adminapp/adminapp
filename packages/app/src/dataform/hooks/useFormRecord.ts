import { useContextSelector } from '../../mutable';
import { DataFormContext } from '../context';

export function useFormRecord() {
  const record = useContextSelector(DataFormContext, (state) => state.record);
  return record;
}

import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';

export function useRecordId<T extends string | number = string>(): T {
  return useContextSelector(DataFormContext, (state) => state.recordId) as T;
}

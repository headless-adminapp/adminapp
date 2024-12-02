import { useContextSelector } from '../../mutable';
import { AuthContext } from '../context';

export function useIsSkipAuthCheck(): boolean {
  return useContextSelector(
    AuthContext,
    (state) => state.skipAuthCheck ?? false
  );
}

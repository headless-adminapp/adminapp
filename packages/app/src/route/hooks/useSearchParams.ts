import { useContext } from 'react';

import { RouterSearchParamsContext } from '../context';

export function useSearchParams() {
  return useContext(RouterSearchParamsContext);
}

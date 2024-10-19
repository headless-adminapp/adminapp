import { useContext } from 'react';

import { RouterPathnameContext } from '../context';

export function usePathname() {
  return useContext(RouterPathnameContext);
}

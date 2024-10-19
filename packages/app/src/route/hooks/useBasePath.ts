import { useContext } from 'react';

import { RouterBasePathContext } from '../context';

export function useBasePath() {
  return useContext(RouterBasePathContext);
}

import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

export const AppLayout2 = dynamic<PropsWithChildren<{ dehydratedState: any }>>(
  () => import('./app2'),
  {
    loading: () => null,
  }
);

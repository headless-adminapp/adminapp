import { FC } from 'react';

import { GridHeaderDesktop } from './GridHeaderDesktop';
import { GridHeaderDesktopV2 } from './GridHeaderDesktopV2';

export const GridHeaderContainer: FC = () => {
  return <GridHeaderDesktop />;
};

export const GridHeaderContainerV2: FC = () => {
  return <GridHeaderDesktopV2 />;
};

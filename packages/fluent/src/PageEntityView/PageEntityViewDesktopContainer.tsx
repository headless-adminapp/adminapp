import { FC } from 'react';

import { CommandContainer } from '../DataGrid/CommandContainer';
import {
  GridHeaderContainer,
  GridHeaderContainerV2,
} from '../DataGrid/GridHeaderContainer';
import { GridPaginationContainer } from '../DataGrid/GridPaginationContainer';
import { GridTableContainer } from '../DataGrid/GridTableContainer';
import { PageEntityViewDesktopFrame } from './PageEntityViewDesktopFrame';
import { PageEntityViewDesktopFrameV2 } from './PageEntityViewDesktopFrameV2';

export const PageEntityViewDesktopContainer: FC = () => {
  return (
    <PageEntityViewDesktopFrame
      commandBar={<CommandContainer />}
      header={<GridHeaderContainer />}
      content={<GridTableContainer headerHeight={33} rowHeight={44} />}
      footer={<GridPaginationContainer />}
    />
  );
};

export const PageEntityViewDesktopContainerV2: FC = () => {
  return (
    <PageEntityViewDesktopFrameV2
      header={<GridHeaderContainerV2 />}
      content={
        <GridTableContainer noPadding headerHeight={40} rowHeight={44} />
      }
      footer={<GridPaginationContainer />}
    />
  );
};

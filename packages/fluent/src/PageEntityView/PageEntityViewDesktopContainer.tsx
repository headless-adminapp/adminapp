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

interface PageEntityViewDesktopContainerProps {
  rowHeight?: number;
}

export const PageEntityViewDesktopContainer: FC<
  PageEntityViewDesktopContainerProps
> = ({ rowHeight }) => {
  return (
    <PageEntityViewDesktopFrame
      commandBar={<CommandContainer />}
      header={<GridHeaderContainer />}
      content={
        <GridTableContainer headerHeight={33} rowHeight={rowHeight ?? 44} />
      }
      footer={<GridPaginationContainer />}
    />
  );
};

export const PageEntityViewDesktopContainerV2: FC<
  PageEntityViewDesktopContainerProps
> = ({ rowHeight }) => {
  return (
    <PageEntityViewDesktopFrameV2
      header={<GridHeaderContainerV2 />}
      content={
        <GridTableContainer
          noPadding
          headerHeight={40}
          rowHeight={rowHeight ?? 44}
        />
      }
      footer={<GridPaginationContainer />}
    />
  );
};

import { FC, Fragment } from 'react';

import { CommandContainer } from '../DataGrid/CommandContainer';
import { GridHeaderContainer } from '../DataGrid/GridHeaderContainer';
import { GridPaginationContainer } from '../DataGrid/GridPaginationContainer';
import { GridTableContainer } from '../DataGrid/GridTableContainer';
import { PageEntityViewDesktopFrame } from './PageEntityViewDesktopFrame';

export const PageEntityViewDesktopContainer: FC = () => {
  return (
    <Fragment>
      <PageEntityViewDesktopFrame
        commandBar={<CommandContainer />}
        header={<GridHeaderContainer />}
        content={<GridTableContainer />}
        footer={<GridPaginationContainer />}
      />
    </Fragment>
  );
};

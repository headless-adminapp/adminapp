import { FC, Fragment } from 'react';

import { CommandContainer } from '../DataGrid/CommandContainer';
import { GridHeaderMobile } from '../DataGrid/GridHeaderMobile';
import { GridListContainer } from '../DataGrid/GridListContainer';
import { GridPaginationContainer } from '../DataGrid/GridPaginationContainer';
import { PageEntityViewDesktopFrame } from './PageEntityViewDesktopFrame';

export const PageEntityViewMobileContainer: FC = () => {
  return (
    <Fragment>
      <PageEntityViewDesktopFrame
        commandBar={<CommandContainer />}
        header={<GridHeaderMobile />}
        content={<GridListContainer />}
        footer={<GridPaginationContainer />}
      />
    </Fragment>
  );
};

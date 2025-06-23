import { FC } from 'react';

import { CommandContainer } from '../DataGrid/CommandContainer';
import { GridHeaderMobile } from '../DataGrid/GridHeaderMobile';
import { GridListContainer } from '../DataGrid/GridListContainer';
import { PageEntityViewMobileFrame } from './PageEntityViewMobileFrame';

export const PageEntityViewMobileContainer: FC = () => {
  return (
    <PageEntityViewMobileFrame
      commandBar={<CommandContainer />}
      header={<GridHeaderMobile />}
      content={<GridListContainer />}
    />
  );
};

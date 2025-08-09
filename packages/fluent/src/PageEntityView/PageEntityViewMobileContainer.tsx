import { FC } from 'react';

import { GridHeaderMobile } from '../DataGrid/GridHeaderMobile';
import { GridListContainer } from '../DataGrid/GridListContainer';
import { PageEntityViewMobileFrame } from './PageEntityViewMobileFrame';

export const PageEntityViewMobileContainer: FC = () => {
  return (
    <PageEntityViewMobileFrame
      header={<GridHeaderMobile />}
      content={<GridListContainer />}
    />
  );
};

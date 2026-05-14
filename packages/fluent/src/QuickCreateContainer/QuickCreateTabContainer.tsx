import { useSelectedForm } from '@headless-adminapp/app/dataform';
import type { FC } from 'react';

import { TabContainer } from '../PageEntityForm/TabContainer';

export const QuickCreateTabContainer: FC = () => {
  const formConfig = useSelectedForm();

  if (formConfig.experience.tabs.length < 2) {
    return null;
  }

  return <TabContainer />;
};

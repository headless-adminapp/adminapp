import { useMainGridCommands } from '@headless-adminapp/app/datagrid';
import { FC } from 'react';

import { MobileHeaderCommandContainer } from '../Header/MobileHeaderCommandContainer';

export const MobileHeaderRightContainer: FC = () => {
  const commands = useMainGridCommands();

  return <MobileHeaderCommandContainer commands={commands} />;
};

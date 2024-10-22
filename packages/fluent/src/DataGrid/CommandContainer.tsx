import { useMainGridCommands } from '@headless-adminapp/app/datagrid/hooks';
import { FC } from 'react';

import { OverflowCommandBar } from '../OverflowCommandBar';

export const CommandContainer: FC = () => {
  const gridCommands = useMainGridCommands();

  return <OverflowCommandBar commands={gridCommands} />;
};

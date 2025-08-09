import { useMainFormCommands } from '@headless-adminapp/app/dataform';
import { FC } from 'react';

import { MobileHeaderCommandContainer } from '../Header/MobileHeaderCommandContainer';

export const MobileHeaderRightContainer: FC = () => {
  const commands = useMainFormCommands();

  return <MobileHeaderCommandContainer commands={commands} />;
};

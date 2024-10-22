import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useMainGridCommands,
  useSubGridCommands,
} from '@headless-adminapp/app/datagrid/hooks';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { FC } from 'react';

import { OverflowCommandBar } from '../OverflowCommandBar';

export const FormSubgridCommandContainer: FC = () => {
  const isSubgrid = useContextSelector(GridContext, (state) => state.isSubGrid);

  if (isSubgrid) {
    return <InternalSubGridCommandContainer />;
  }

  return <InternalMainGridCommandContainer />;
};

const InternalMainGridCommandContainer: FC = () => {
  const gridCommands = useMainGridCommands();

  return <OverflowCommandBar commands={gridCommands} />;
};

const InternalSubGridCommandContainer: FC = () => {
  const gridCommands = useSubGridCommands();

  return <OverflowCommandBar commands={gridCommands} />;
};

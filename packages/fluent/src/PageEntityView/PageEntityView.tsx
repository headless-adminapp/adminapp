import { useLoadMainGridPage } from '@headless-adminapp/app/datagrid';
import { PageEntityViewProvider } from '@headless-adminapp/app/providers/PageEntityViewProvider';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { PageBroken } from '../components/PageBroken';
import { PageLoading } from '../components/PageLoading';
import { PageEntityViewDesktopContainer } from './PageEntityViewDesktopContainer';

interface PageEntityViewProps {
  logicalName: string;
  viewId?: string;
  onChangeView?: (viewId: string) => void;
}

export const PageEntityView: FC<PageEntityViewProps> = ({
  logicalName,
  viewId,
  onChangeView,
}) => {
  const result = useLoadMainGridPage(logicalName, viewId);

  if (result.loading) {
    return <PageLoading />;
  }

  if (result.error) {
    return (
      <PageBroken
        Icon={Icons.Error}
        title={result.title}
        message={result.message}
      />
    );
  }

  const { schema, commands, viewLookup, view } = result;

  return (
    <PageEntityViewProvider
      schema={schema}
      view={view}
      availableViews={viewLookup}
      commands={commands}
      onChangeView={onChangeView}
    >
      <PageEntityViewDesktopContainer />
    </PageEntityViewProvider>
  );
};

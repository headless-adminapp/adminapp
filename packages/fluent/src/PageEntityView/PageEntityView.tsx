import { useLoadMainGridPage } from '@headless-adminapp/app/datagrid';
import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { PageEntityViewProvider } from '@headless-adminapp/app/providers/PageEntityViewProvider';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { PageBroken } from '../components/PageBroken';
import { PageLoading } from '../components/PageLoading';
import {
  PageEntityViewDesktopContainer,
  PageEntityViewDesktopContainerV2,
} from './PageEntityViewDesktopContainer';
import { PageEntityViewMobileContainer } from './PageEntityViewMobileContainer';

interface PageEntityViewProps {
  logicalName: string;
  viewId?: string;
  onChangeView?: (viewId: string) => void;
  useV2?: boolean; // Exprement component
}

export const PageEntityView: FC<PageEntityViewProps> = ({
  logicalName,
  viewId,
  onChangeView,
  useV2,
}) => {
  const result = useLoadMainGridPage(logicalName, viewId);
  const isMobile = useIsMobile();

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

  let content = null;

  if (isMobile) {
    content = <PageEntityViewMobileContainer />;
  } else if (!useV2) {
    content = <PageEntityViewDesktopContainer />;
  } else {
    content = <PageEntityViewDesktopContainerV2 />;
  }

  return (
    <HistoryStateKeyProvider historyKey={'page-entity-view.' + logicalName}>
      <PageEntityViewProvider
        schema={schema}
        view={view}
        availableViews={viewLookup}
        commands={commands}
        onChangeView={onChangeView}
      >
        {content}
      </PageEntityViewProvider>
    </HistoryStateKeyProvider>
  );
};

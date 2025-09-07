import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { DataGridProvider } from '@headless-adminapp/app/datagrid/DataGridProvider';
import { useGridControlContext } from '@headless-adminapp/app/datagrid/hooks';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import {
  useExperienceView,
  useExperienceViewCommands,
  useSchema,
} from '@headless-adminapp/app/metadata/hooks';
import { View } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';

import { BodyLoading } from '../components/BodyLoading';
import { GridTableContainer } from '../DataGrid';
import { GridListContainer } from '../DataGrid/GridListContainer';
import { WidgetSection } from './WidgetSection';
import { WidgetTitleBar } from './WidgetTitleBar';

interface WidgetDataGridContainerProps {
  title: string;
  logicalName: string;
  maxRecords?: number;
  filter?: Filter;
  commands?: any[][];
  view?: View<SchemaAttributes>;
  viewId?: string;
  allowContextMenu?: boolean;
}

/*** @deprecated Need refactoring */
export function WidgetDataGridContainer({
  logicalName,
  maxRecords,
  filter,
  commands,
  title,
  view,
  viewId,
  allowContextMenu,
}: Readonly<WidgetDataGridContainerProps>) {
  const schema = useSchema(logicalName);
  const { view: _view, isLoadingView } = useExperienceView(logicalName, viewId);
  const { commands: contextCommands } = useExperienceViewCommands(logicalName);

  view ??= _view;

  if (!view && isLoadingView) {
    return (
      <WidgetSection>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <BodyLoading />
        </div>
      </WidgetSection>
    );
  }

  if (!view) {
    return (
      <WidgetSection>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          View not found
        </div>
      </WidgetSection>
    );
  }

  if (!schema) {
    return (
      <WidgetSection>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          Schema not found
        </div>
      </WidgetSection>
    );
  }

  return (
    <DataGridProvider
      schema={schema}
      view={view}
      views={[]}
      onChangeView={() => {}}
      commands={contextCommands}
      allowViewSelection={false}
      maxRecords={maxRecords}
      extraFilter={filter}
    >
      <FormSubgridContainer
        title={title}
        commands={commands}
        allowContextMenu={allowContextMenu}
      />
    </DataGridProvider>
  );
}

const FormSubgridContainer = ({
  title,
  commands,
  allowContextMenu,
}: Pick<
  WidgetDataGridContainerProps,
  'title' | 'commands' | 'allowContextMenu'
>) => {
  const isMobile = useIsMobile();
  const baseCommandHandleContext = useBaseCommandHandlerContext();
  const primaryControl = useGridControlContext();

  const transformedCommands = useCommands(commands, {
    ...baseCommandHandleContext,
    primaryControl,
  });

  return (
    <WidgetSection>
      <WidgetTitleBar title={title} commands={transformedCommands} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginTop: 8,
          }}
        >
          <div
            style={{
              gap: 16,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div style={{ flex: 1, display: 'flex', minHeight: 300 }}>
              {!isMobile ? (
                <GridTableContainer
                  disableColumnSort
                  disableColumnFilter
                  disableSelection
                  disableContextMenu={!allowContextMenu}
                />
              ) : (
                <GridListContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </WidgetSection>
  );
};

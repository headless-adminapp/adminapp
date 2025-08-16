import { tokens } from '@fluentui/react-components';
import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { DataGridProvider } from '@headless-adminapp/app/datagrid/DataGridProvider';
import { useGridControlContext } from '@headless-adminapp/app/datagrid/hooks';
import {
  useExperienceView,
  useExperienceViewCommands,
  useSchema,
} from '@headless-adminapp/app/metadata/hooks';
import { View } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';

import { GridTableContainer } from '../DataGrid';
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
    return <div>Loading...</div>;
  }

  if (!view) {
    return <div>View not found</div>;
  }

  if (!schema) {
    return <div>Schema not found</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow2,
        borderRadius: tokens.borderRadiusMedium,
        // padding: tokens.spacingHorizontalM,
        flexDirection: 'column',
      }}
    >
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
    </div>
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
  const baseCommandHandleContext = useBaseCommandHandlerContext();
  const primaryControl = useGridControlContext();

  const transformedCommands = useCommands(commands, {
    ...baseCommandHandleContext,
    primaryControl,
  });

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
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
              <GridTableContainer
                disableColumnSort
                disableColumnFilter
                disableSelection
                disableContextMenu={!allowContextMenu}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

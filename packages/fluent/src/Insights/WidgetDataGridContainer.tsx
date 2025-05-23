import { tokens } from '@fluentui/react-components';
import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { DataGridProvider } from '@headless-adminapp/app/datagrid/DataGridProvider';
import { useGridControlContext } from '@headless-adminapp/app/datagrid/hooks';
import {
  useExperienceView,
  useSchema,
} from '@headless-adminapp/app/metadata/hooks';
import { Filter } from '@headless-adminapp/core/transport';

import { GridTableContainer } from '../DataGrid';
import { WidgetTitleBar } from './WidgetTitleBar';

interface WidgetDataGridContainerProps {
  title: string;
  logicalName: string;
  maxRecords?: number;
  filter?: Filter;
  commands?: any[][];
}

/*** @deprecated Need refactoring */
export function WidgetDataGridContainer({
  logicalName,
  maxRecords,
  filter,
  commands,
  title,
}: Readonly<WidgetDataGridContainerProps>) {
  const schema = useSchema(logicalName);
  const { view } = useExperienceView(logicalName);

  if (!view) {
    return <div>Loading...</div>;
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
        commands={[]}
        allowViewSelection={false}
        maxRecords={maxRecords}
        extraFilter={filter}
      >
        <FormSubgridContainer title={title} commands={commands} />
      </DataGridProvider>
    </div>
  );
}

const FormSubgridContainer = ({
  title,
  commands,
}: Pick<WidgetDataGridContainerProps, 'title' | 'commands'>) => {
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
                disableContextMenu
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

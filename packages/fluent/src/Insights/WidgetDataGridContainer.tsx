import { tokens } from '@fluentui/react-components';
import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { DataGridProvider } from '@headless-adminapp/app/datagrid/DataGridProvider';
import { useGridControlContext } from '@headless-adminapp/app/datagrid/hooks';
import {
  useExperienceView,
  useSchema,
} from '@headless-adminapp/app/metadata/hooks';
import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { WidgetContext } from '@headless-adminapp/app/widget';
import { DataGridWidgetExperience } from '@headless-adminapp/core/experience/insights';
import { useCallback } from 'react';

import { GridTableContainer } from '../DataGrid';
import { WidgetTitleBar } from './WidgetTitleBar';

export function WidgetDataGridContainer({
  content,
}: {
  content: DataGridWidgetExperience;
}) {
  const logicalName = content.logicalName;
  const schema = useSchema(logicalName);
  const { view } = useExperienceView(logicalName);

  if (!view) {
    return <div>Loading...</div>;
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
        maxRecords={content.maxRecords}
        extraFilter={content.filter}
      >
        <FormSubgridContainer content={content} />
      </DataGridProvider>
    </div>
  );
}

const FormSubgridContainer = ({
  content,
}: {
  content: DataGridWidgetExperience;
}) => {
  const baseCommandHandleContext = useBaseCommandHandlerContext();
  const primaryControl = useGridControlContext();

  const widgetSetValue = useContextSetValue(WidgetContext);

  const updateStateValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any) => {
      widgetSetValue((state) => ({
        ...state,
        data: { ...state.data, ...value },
      }));
    },
    [widgetSetValue]
  );

  const transformedCommands = useCommands([content.commands], {
    ...baseCommandHandleContext,
    primaryControl: {
      ...primaryControl,
      updateStateValue,
    },
  });

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        // gap: 8,
        // backgroundColor: tokens.colorNeutralBackground2,
        // padding: 2,
        overflow: 'hidden',
      }}
    >
      <WidgetTitleBar
        title="Recent transactions"
        commands={transformedCommands}
      />
      <div
        style={{
          // gap: 12,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          // overflow: 'hidden',
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

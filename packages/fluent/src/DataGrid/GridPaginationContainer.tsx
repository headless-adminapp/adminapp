import { Body1, tokens } from '@fluentui/react-components';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridColumns,
  useGridData,
  useGridSelection,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { FC, Fragment } from 'react';

import { formatCurrency } from '../Insights/charts/formatters';
import { usePageEntityViewStrings } from '../PageEntityView/PageEntityViewStringContext';

interface StatusItem {
  label: string;
  value: string | number;
}

export const GridPaginationContainer: FC = () => {
  const data = useGridData();
  const [selectedIds] = useGridSelection();
  const strings = usePageEntityViewStrings();
  const locale = useLocale();

  const leftSideItems: StatusItem[] = [];
  const rightSideItems: StatusItem[] = [];

  leftSideItems.push({
    label: strings.records,
    value: data?.count ?? '-',
  });
  leftSideItems.push({
    label: strings.loaded,
    value: data?.records.length ?? '-',
  });

  if (data?.count && selectedIds.length) {
    leftSideItems.push({
      label: strings.selected,
      value: selectedIds.length,
    });
  }

  const range = useContextSelector(
    GridContext,
    (state) => state.cellSelectionRange
  );

  const gridColumns = useGridColumns();
  const schema = useDataGridSchema();

  if (
    range &&
    range.start.column === range.end.column &&
    range.start.row !== range.end.row
  ) {
    const startRowIndex = Math.min(range.start.row, range.end.row);
    const endRowIndex = Math.max(range.start.row, range.end.row);

    const columnIndex = range.start.column;

    const column = gridColumns[columnIndex];

    const attribute = schema.attributes[column.name];

    rightSideItems.push({
      label: 'Count',
      value: endRowIndex - startRowIndex + 1,
    });

    if (attribute.type === 'money') {
      const total = data?.records
        .slice(startRowIndex, endRowIndex + 1)
        .reduce((sum, record) => {
          return sum + ((record[column.name] as number) ?? 0);
        }, 0);

      rightSideItems.push({
        label: 'Sum',
        value: formatCurrency(locale, total),
      });
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Body1
        style={{
          color: tokens.colorNeutralForeground3,
          display: 'flex',
          gap: 8,
        }}
      >
        {leftSideItems.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <span>|</span>}
            <span>
              {item.label}: {item.value}
            </span>
          </Fragment>
        ))}
      </Body1>
      <div style={{ flex: 1 }} />
      <Body1
        style={{
          color: tokens.colorNeutralForeground3,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        {rightSideItems.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <span>|</span>}
            <span>
              {item.label}: {item.value}
            </span>
          </Fragment>
        ))}
      </Body1>
    </div>
  );
};

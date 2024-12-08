import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from '@fluentui/react-components';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { TableWidgetExperience } from '@headless-adminapp/core/experience/insights';
import { FC } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { useWidgetDetail } from './hooks/useWidgetDetail';
import { WidgetTitleBar } from './WidgetTitleBar';

interface WidgetTableContainerProps {
  content: TableWidgetExperience;
}

export const WidgetTableContainer: FC<WidgetTableContainerProps> = ({
  content,
}) => {
  const { transformedCommands, dataset, isPending, isFetching, widget } =
    useWidgetDetail<TableWidgetExperience>(content);

  const info = content.table;

  const data = dataset[0] as Record<string, unknown>[];

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow2,
        borderRadius: tokens.borderRadiusMedium,
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <WidgetTitleBar title={widget.title} commands={transformedCommands} />
      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {!isPending && (
          <Table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
            }}
          >
            <TableHeader
              style={{
                position: 'sticky',
                top: 0,
                background: tokens.colorNeutralBackground3,
                zIndex: 2,
              }}
            >
              <TableRow
                style={{
                  position: 'sticky',
                  top: 0,
                  minWidth: 'calc(100% - 16px)',
                }}
              >
                {info.columns.map((column, index) => {
                  const attribute = info.attributes[column];

                  return (
                    <TableHeaderCell
                      key={index}
                      style={{
                        minWidth: 32,
                        flexShrink: 0,
                        flex: 1,
                        position: 'sticky',
                        background: tokens.colorNeutralBackground3,
                        borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
                      }}
                    >
                      {attribute.label}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {info.columns.map((column) => {
                    const attribute = info.attributes[column];
                    const value = row[column];

                    const formattedValue =
                      getAttributeFormattedValue(attribute, value) ?? '';

                    switch (attribute?.type) {
                      case 'money':
                        return (
                          <TableCell key={column}>{formattedValue}</TableCell>
                        );
                      case 'lookup':
                        return null;
                    }

                    return <TableCell key={column}>{formattedValue}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <BodyLoading loading={isFetching} />
      </div>
    </div>
  );
};

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { Attribute } from '@headless-adminapp/core';
import { FC } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { WidgetSection } from './WidgetSection';
import { WidgetTitleBar } from './WidgetTitleBar';

const useStyles = makeStyles({
  table: {
    borderCollapse: 'collapse',
    width: '100%',

    '& tr': {
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
    },
    '& th': {
      fontWeight: tokens.fontWeightMedium,
      minWidth: '32px',
      flexShrink: 0,
      flex: 1,
      position: 'sticky',
      background: tokens.colorNeutralBackground3,
      borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
    },
    '& td': {
      height: '36px',
    },
  },
  headerAlignRight: {
    textAlign: 'right',
    '& > div': {
      justifyContent: 'flex-end',
    },
  },
});

interface WidgetTableContainerProps {
  title: string;
  columns: string[];
  attributes: Record<string, Attribute>;
  isPending?: boolean;
  isFetching?: boolean;
  commands?: CommandItemState[][];
  data: any[];
}

export const WidgetTableContainer: FC<WidgetTableContainerProps> = ({
  title,
  columns,
  attributes,
  isPending,
  isFetching,
  commands,
  data,
}) => {
  const locale = useLocale();
  const styles = useStyles();

  return (
    <WidgetSection>
      <WidgetTitleBar title={title} commands={commands} />
      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {!isPending && (
          <Table className={styles.table}>
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
                {columns.map((column, index) => {
                  const attribute = attributes[column];

                  return (
                    <TableHeaderCell
                      key={column + String(index)}
                      align="right"
                      className={
                        attribute?.type === 'money'
                          ? styles.headerAlignRight
                          : ''
                      }
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
                  {columns.map((column) => {
                    const attribute = attributes[column];
                    const value = row[column];

                    const formattedValue =
                      getAttributeFormattedValue(attribute, value, locale) ??
                      '';

                    switch (attribute?.type) {
                      case 'money':
                        return (
                          <TableCell
                            key={column}
                            style={{ textAlign: 'right' }}
                          >
                            {formattedValue}
                          </TableCell>
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
    </WidgetSection>
  );
};

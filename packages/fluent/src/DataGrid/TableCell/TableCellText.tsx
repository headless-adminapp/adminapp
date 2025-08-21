import { FC, memo, PropsWithChildren } from 'react';

import { CellDisplayType, TableCellBase } from './TableCellBase';

export interface TableCellTextProps {
  value: string;
  width?: number;
  textAlignment?: 'left' | 'center' | 'right';
  display?: CellDisplayType;
}

export const TableCellText: FC<TableCellTextProps> = memo(
  ({ value, width, textAlignment, display }) => {
    return (
      <TableCellBase
        display={display}
        style={{
          textAlign: textAlignment ?? 'left',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width,
          minWidth: width,
          maxWidth: width,
        }}
      >
        <TableCellTextContent>{value}</TableCellTextContent>
      </TableCellBase>
    );
  }
);

TableCellText.displayName = 'TableCellText';

export const TableCellTextContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

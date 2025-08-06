import { FC, memo } from 'react';

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
          // maxWidth: 50,
          // width: 50,
          // width: '100%',
          width,
          minWidth: width,
          maxWidth: width,
          // minWidth: 200,
          // display: 'flex',
          // alignItems: 'center',
          // borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
        >
          {value}
        </div>
      </TableCellBase>
    );
  }
);

TableCellText.displayName = 'TableCellText';

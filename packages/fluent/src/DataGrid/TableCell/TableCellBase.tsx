import { TableCell as TableCellInternal } from '@fluentui/react-components';
import { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';

export type CellDisplayType = 'flex' | 'table-cell';

export interface TableCellBaseProps {
  children?: ReactNode;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
  display?: CellDisplayType;
}

export const TableCellBase: FC<TableCellBaseProps> = ({
  children,
  onClick,
  style,
  display = 'flex',
}) => {
  return (
    <TableCellInternal
      onClick={onClick}
      style={{
        display,
        alignItems: 'center',
        height: '100%',
        // borderBottom: `var(--strokeWidthThin) solid var(--colorNeutralStroke2)`,
        ...style,
      }}
    >
      {children}
    </TableCellInternal>
  );
};

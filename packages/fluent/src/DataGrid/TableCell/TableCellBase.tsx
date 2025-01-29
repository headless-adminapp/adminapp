import { TableCell as TableCellInternal } from '@fluentui/react-components';
import { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';

export interface TableCellBaseProps {
  children?: ReactNode;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}

export const TableCellBase: FC<TableCellBaseProps> = ({
  children,
  onClick,
  style,
}) => {
  return (
    <TableCellInternal
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        // borderBottom: `var(--strokeWidthThin) solid var(--colorNeutralStroke2)`,
        ...style,
      }}
    >
      {children}
    </TableCellInternal>
  );
};

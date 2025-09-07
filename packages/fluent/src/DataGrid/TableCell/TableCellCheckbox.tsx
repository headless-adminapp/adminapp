import { TableCell } from '@fluentui/react-components';
import { FC, memo } from 'react';

import { Checkbox } from '../../components/fluent/Checkbox';

export interface TableCellCheckboxProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TableCellCheckbox: FC<TableCellCheckboxProps> = memo(
  ({ checked, onChange }) => {
    return (
      <TableCell
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Checkbox
          checked={checked ?? false}
          onChange={(event) => {
            event.stopPropagation();
            onChange?.(event);
          }}
        />
      </TableCell>
    );
  }
);

TableCellCheckbox.displayName = 'TableCellCheckbox';

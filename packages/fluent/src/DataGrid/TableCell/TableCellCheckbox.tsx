import { Checkbox,TableCell } from '@fluentui/react-components';
import { FC } from 'react';

export interface TableCellCheckboxProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TableCellCheckbox: FC<TableCellCheckboxProps> = ({
  checked,
  onChange,
}) => {
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
};
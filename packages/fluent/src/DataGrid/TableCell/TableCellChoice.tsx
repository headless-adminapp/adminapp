import { ChoiceAttribute } from '@headless-adminapp/core/attributes';

import { ChoiceBadge } from '../../components/ChoiceBadge';
import { CellDisplayType, TableCellBase } from './TableCellBase';

interface TableCellChoiceProps {
  value: unknown;
  attribute: ChoiceAttribute<string | number>;
  formattedValue: string;
  width?: number;
  display?: CellDisplayType;
}

export function TableCellChoice(props: Readonly<TableCellChoiceProps>) {
  return (
    <TableCellBase
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: props.width,
        minWidth: props.width,
        maxWidth: props.width,
      }}
      display={props.display}
    >
      <ChoiceBadge
        attribute={props.attribute}
        formattedValue={props.formattedValue}
        value={props.value}
      />
    </TableCellBase>
  );
}

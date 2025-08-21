import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { FC } from 'react';

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
      <TableCellChoiceContent
        attribute={props.attribute}
        formattedValue={props.formattedValue}
        value={props.value}
      />
    </TableCellBase>
  );
}

interface TableCellChoiceContentProps {
  attribute: ChoiceAttribute<string | number>;
  formattedValue: string;
  value: unknown;
}

export const TableCellChoiceContent: FC<TableCellChoiceContentProps> = (
  props
) => {
  return (
    <ChoiceBadge
      attribute={props.attribute}
      formattedValue={props.formattedValue}
      value={props.value}
    />
  );
};

import type { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import type { OptionLookup } from '@headless-adminapp/core/attributes/DataLookup';
import type { FC } from 'react';

import { ChoiceBadge } from '../../components/ChoiceBadge';
import { type CellDisplayType, TableCellBase } from './TableCellBase';

interface TableCellChoiceProps {
  value: OptionLookup;
  attribute: ChoiceAttribute;
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
  attribute: ChoiceAttribute;
  formattedValue: string;
  value: OptionLookup;
}

export const TableCellChoiceContent: FC<TableCellChoiceContentProps> = (
  props,
) => {
  return (
    <ChoiceBadge
      attribute={props.attribute}
      formattedValue={props.formattedValue}
      value={props.value}
    />
  );
};

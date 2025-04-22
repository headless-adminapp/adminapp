import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { ViewColumn } from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';

import { ChoiceBadge } from '../../components/ChoiceBadge';
import { UniqueRecord } from '../types';
import { TableCellBase } from './TableCellBase';

interface TableCellChoiceProps {
  column: ViewColumn;
  schema: Schema;
  record: UniqueRecord;
  value: unknown;
  attribute: ChoiceAttribute<string | number>;
  formattedValue: string;
  width: number;
}

export function TableCellChoice(props: TableCellChoiceProps) {
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
    >
      <ChoiceBadge
        attribute={props.attribute}
        formattedValue={props.formattedValue}
        value={props.value}
      />
    </TableCellBase>
  );
}

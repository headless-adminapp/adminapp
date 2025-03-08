import { Badge, tokens } from '@fluentui/react-components';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { ViewColumn } from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';
import { useMemo } from 'react';

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
  const bgColor = useMemo(() => {
    if (!props.value || !props.attribute.options) {
      return;
    }

    return props.attribute.options.find(
      (option) => option.value === props.value
    )?.color;
  }, [props.attribute.options, props.value]);

  const color = useMemo(() => {
    if (!bgColor) {
      return;
    }

    return isColorDark(bgColor) ? '#FFFFFF' : '#000000';
  }, [bgColor]);

  if (!props.formattedValue) {
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
      />
    );
  }

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
      <Badge
        style={{
          backgroundColor: bgColor ?? tokens.colorNeutralBackground3,
          color: color ?? tokens.colorNeutralForeground2,
          fontWeight: tokens.fontWeightRegular,
        }}
      >
        {props.formattedValue}
      </Badge>
    </TableCellBase>
  );
}

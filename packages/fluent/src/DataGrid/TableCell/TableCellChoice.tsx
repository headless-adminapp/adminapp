import { Tag } from '@fluentui/react-components';
import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { ViewColumn } from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';
import { useMemo } from 'react';

import { UniqueRecord } from '../types';
import { TableCellBase } from './TableCellBase';

function isColorDark(color: string) {
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

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
  }, [props.formattedValue]);

  const color = useMemo(() => {
    if (!bgColor) {
      return;
    }

    return isColorDark(bgColor) ? '#FFFFFF' : '#000000';
  }, [bgColor]);

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
      <Tag size="small" style={{ backgroundColor: bgColor, color }}>
        {props.formattedValue}
      </Tag>
    </TableCellBase>
  );
}

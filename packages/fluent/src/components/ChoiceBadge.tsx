import { Badge, tokens } from '@fluentui/react-components';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { useMemo } from 'react';

interface ChoiceBadgeProps {
  value: unknown;
  attribute: ChoiceAttribute<string | number>;
  formattedValue: string | null;
  size?: 'small' | 'medium';
}

export function ChoiceBadge(props: Readonly<ChoiceBadgeProps>) {
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
    return null;
  }

  return (
    <Badge
      style={{
        backgroundColor: bgColor ?? tokens.colorNeutralBackground3,
        color: color ?? tokens.colorNeutralForeground2,
        fontWeight: tokens.fontWeightRegular,
      }}
      size={props.size}
    >
      {props.formattedValue}
    </Badge>
  );
}

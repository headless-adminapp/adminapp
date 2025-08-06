import { Badge, tokens } from '@fluentui/react-components';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import { useMemo } from 'react';

interface ChoiceBadgeProps {
  value: unknown;
  attribute:
    | ChoiceAttribute<string | number>
    | ChoicesAttribute<string | number>;
  formattedValue?: string | null;
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

  const formattedValue = useMemo(() => {
    if (props.formattedValue) {
      return props.formattedValue;
    }

    if (!props.value) {
      return null;
    }

    const choice = props.attribute.options.find(
      (option) => option.value === props.value
    );

    if (!choice) {
      return null;
    }

    return choice.label;
  }, [props.attribute.options, props.formattedValue, props.value]);

  if (!formattedValue) {
    return null;
  }

  return (
    <Badge
      style={{
        backgroundColor: bgColor ?? tokens.colorNeutralBackground3,
        color: color ?? tokens.colorNeutralForeground2,
        fontWeight: tokens.fontWeightRegular,
        minWidth: 'unset',
        maxWidth: 'max-content',
        width: '100%',
      }}
      size={props.size}
    >
      <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {formattedValue}
      </div>
    </Badge>
  );
}

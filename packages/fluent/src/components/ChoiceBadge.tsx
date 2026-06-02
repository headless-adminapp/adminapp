import { Badge, tokens } from '@fluentui/react-components';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import type { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import type { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import type { OptionLookup } from '@headless-adminapp/core/attributes/DataLookup';
import { useMemo } from 'react';

interface ChoiceBadgeProps {
  value: OptionLookup;
  attribute: ChoiceAttribute | ChoicesAttribute;
  formattedValue?: string | null;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export function ChoiceBadge(props: Readonly<ChoiceBadgeProps>) {
  let _value: string | number | undefined;

  if (typeof props.value === 'string') {
    _value = props.value;
  } else if (props.value) {
    _value = props.value.value;
  }

  const bgColor = useMemo(() => {
    if (!_value || !props.attribute.options) {
      return;
    }

    return props.attribute.options.find((option) => option.value === _value)
      ?.color;
  }, [props.attribute.options, _value]);

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

    if (!_value) {
      return null;
    }

    const choice = props.attribute.options.find(
      (option) => option.value === _value,
    );

    if (!choice) {
      return null;
    }

    return choice.label;
  }, [props.attribute.options, props.formattedValue, _value]);

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

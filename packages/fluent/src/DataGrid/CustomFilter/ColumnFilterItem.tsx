import { tokens } from '@fluentui/react-components';
import { getLocalizedOperatorOptions } from '@headless-adminapp/app/datagrid';
import { Attribute } from '@headless-adminapp/core/attributes';
import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { OperatorKey } from '@headless-adminapp/core/transport';
import { Icons } from '@headless-adminapp/icons';
import { FC, useMemo } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { extendedTokens } from '../../components/fluent';
import { Button } from '../../components/fluent/Button';
import { TextControl } from '../../form/controls/TextControl';
import { ConditionValueControl } from '../GridColumnHeader/ConditionValueControl';
import { OperatorSelect } from '../GridColumnHeader/OperatorSelect';

interface ColumnFilterItemProps {
  attribute: Attribute;
  condition: ColumnCondition;
  onChange?: (condition: ColumnCondition) => void;
  onRemove?: () => void;
}

export const ColumnFilterItem: FC<ColumnFilterItemProps> = ({
  condition,
  attribute,
  onChange,
  onRemove,
}) => {
  const { operatorStrings } = useAppStrings();

  const operatorOptions = useMemo(() => {
    return getLocalizedOperatorOptions(operatorStrings);
  }, [operatorStrings]);

  const selectedOption = useMemo(() => {
    return operatorOptions[attribute.type].find(
      (option) => option.value === condition.operator
    )!;
  }, [condition.operator, attribute.type, operatorOptions]);

  const handleChangeOperator = (operator: OperatorKey) => {
    onChange?.({
      ...condition,
      operator,
      value: [],
    });
  };

  const handleChangeValue = (value: any, index: number) => {
    const next = [...condition.value];
    next[index] = value;
    onChange?.({
      ...condition,
      value: next,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
        border: `1px solid ${tokens.colorNeutralStroke3}`,
        borderRadius: extendedTokens.paperBorderRadius,
        padding: tokens.spacingVerticalM,
      }}
    >
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
        <TextControl readOnly value={attribute.label} />
        <Button
          style={{ alignSelf: 'flex-start' }}
          icon={<Icons.Delete size={20} />}
          appearance="subtle"
          onClick={onRemove}
        />
      </div>
      <OperatorSelect
        attribute={attribute}
        onChange={(value) => handleChangeOperator(value)}
        value={condition.operator}
      />
      {selectedOption?.controls.map((x, i) => (
        <ConditionValueControl
          key={x + String(i)}
          type={x}
          attribute={attribute}
          value={condition.value[i] ?? null}
          onChange={(value) => {
            handleChangeValue(value, i);
          }}
        />
      ))}
    </div>
  );
};

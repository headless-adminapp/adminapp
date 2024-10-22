import { getLocalizedOperatorOptions } from '@headless-adminapp/app/datagrid/column-filter';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { OperatorKey } from '@headless-adminapp/core/transport';
import { useMemo } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import SelectControl from '../../form/controls/SelectControl';

interface OperatorSelectProps {
  attribute: Attribute;
  value: OperatorKey | null;
  onChange?: (operator: OperatorKey) => void;
}

export function OperatorSelect({
  attribute,
  value,
  onChange,
}: OperatorSelectProps) {
  const { operatorStrings } = useAppStrings();
  const operatorOptions = useMemo(() => {
    return getLocalizedOperatorOptions(operatorStrings);
  }, [operatorStrings]);

  const options = useMemo(() => {
    return operatorOptions[attribute.type];
  }, [attribute.type, operatorOptions]);

  return (
    <SelectControl
      options={options}
      onChange={(value) => onChange?.(value as OperatorKey)}
      value={value}
    />
  );
}

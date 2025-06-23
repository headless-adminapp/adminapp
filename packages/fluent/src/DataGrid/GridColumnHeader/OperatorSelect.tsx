import { getLocalizedOperatorOptions } from '@headless-adminapp/app/datagrid/column-filter';
import { useDataService } from '@headless-adminapp/app/transport';
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
}: Readonly<OperatorSelectProps>) {
  const { operatorStrings } = useAppStrings();
  const dataService = useDataService();
  const operatorOptions = useMemo(() => {
    return getLocalizedOperatorOptions(operatorStrings);
  }, [operatorStrings]);

  const options = useMemo(() => {
    const supportedOperators = dataService.supportedOperators;
    let operators = operatorOptions[attribute.type];

    if (supportedOperators) {
      operators = operators.filter((option) =>
        supportedOperators[attribute.type].includes(option.value)
      );
    }

    return operators;
  }, [attribute.type, operatorOptions, dataService]);

  return (
    <SelectControl
      options={options}
      onChange={(value) => onChange?.(value as OperatorKey)}
      value={value}
    />
  );
}

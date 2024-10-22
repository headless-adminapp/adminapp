import {
  Button,
  DialogActions,
  DialogContent,
  DialogTrigger,
  tokens,
} from '@fluentui/react-components';
import { getLocalizedOperatorOptions } from '@headless-adminapp/app/datagrid/column-filter';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { OperatorKey } from '@headless-adminapp/core/transport';
import { FC, Fragment, useMemo, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { usePageEntityViewStrings } from '../../PageEntityView/PageEntityViewStringContext';
import { ConditionValueControl } from './ConditionValueControl';
import { OperatorSelect } from './OperatorSelect';
import { getDefaultOperator, getDefaultValues } from './utils';

interface FilterFormProps {
  attribute: Attribute;
  defaultValue?: ColumnCondition;
  onApply?: (condition: ColumnCondition) => void;
  onCancel?: () => void;
}

export const FilterForm: FC<FilterFormProps> = ({
  defaultValue,
  attribute,
  onApply,
  onCancel,
}) => {
  const [operator, setOperator] = useState<OperatorKey>(
    getDefaultOperator(defaultValue?.operator, attribute.type)
  );
  const strings = usePageEntityViewStrings();
  const { operatorStrings } = useAppStrings();

  const operatorOptions = useMemo(() => {
    return getLocalizedOperatorOptions(operatorStrings);
  }, [operatorStrings]);

  const selectedOption = useMemo(() => {
    return operatorOptions[attribute.type].find(
      (option) => option.value === operator
    )!;
  }, [operator, attribute.type, operatorOptions]);

  const [values, setValues] = useState(
    getDefaultValues(selectedOption, defaultValue?.value, attribute.type)
  );

  const handleChangeOperator = (operator: OperatorKey) => {
    setOperator(operator);
    setValues([]);
  };

  const handleChangeValue = (value: any, index: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const isValid = useMemo(() => {
    return (
      !!selectedOption &&
      values.filter(Boolean).length === selectedOption.controls.length
    );
  }, [selectedOption, values]);

  return (
    <Fragment>
      <DialogContent style={{ paddingBlock: 8 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacingVerticalS,
          }}
        >
          <OperatorSelect
            attribute={attribute}
            onChange={(value) => handleChangeOperator(value as OperatorKey)}
            value={operator}
          />
          {selectedOption?.controls.map((x, i) => (
            <ConditionValueControl
              key={i}
              type={x}
              attribute={attribute}
              value={values[i] ?? null}
              onChange={(value) => {
                handleChangeValue(value, i);
              }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <DialogTrigger disableButtonEnhancement>
          <Button appearance="secondary" onClick={onCancel}>
            {strings.cancel}
          </Button>
        </DialogTrigger>
        <Button
          type="submit"
          appearance="primary"
          disabled={!isValid}
          onClick={() => {
            onApply?.({
              operator,
              value: values,
            });
          }}
        >
          {strings.apply}
        </Button>
      </DialogActions>
    </Fragment>
  );
};

import type { AttributeType } from '@headless-adminapp/core/attributes';

import { operatorOptions } from './constants';
import { OperatorOption, OperatorStrings } from './types';

export const getLocalizedOperatorOptions = (
  strings: OperatorStrings
): Record<AttributeType, OperatorOption[]> => {
  return Object.entries(operatorOptions).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.map((option) => ({
        ...option,
        label: strings[option.labelKey],
      })),
    }),
    {} as Record<AttributeType, OperatorOption[]>
  );
};

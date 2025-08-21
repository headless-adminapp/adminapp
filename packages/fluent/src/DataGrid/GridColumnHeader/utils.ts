import { OperatorOption } from '@headless-adminapp/app/datagrid';
import type { AttributeType } from '@headless-adminapp/core/attributes';
import { OperatorKey } from '@headless-adminapp/core/transport';

export function getDefaultOperator(
  operator: OperatorKey | undefined,
  attributeType: AttributeType
): OperatorKey {
  if (operator) {
    return operator;
  }

  if (attributeType === 'date') {
    return 'on';
  }

  if (attributeType === 'choice' || attributeType === 'lookup') {
    return 'in';
  }

  if (attributeType === 'string') {
    return 'like';
  }

  return 'eq';
}

export function getDefaultValues(
  operator: OperatorOption,
  value: any,
  _attributeType: AttributeType
): any[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

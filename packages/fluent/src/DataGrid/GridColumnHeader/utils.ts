import { OperatorOption } from '@headless-adminapp/app/datagrid';
import type { AttributeType } from '@headless-adminapp/core/attributes';
import { OperatorKey } from '@headless-adminapp/core/transport';

export function getDefaultOperator(
  operator: OperatorKey | undefined,
  attributeType: AttributeType
) {
  return operator
    ? operator
    : attributeType === 'date'
    ? 'on'
    : attributeType === 'choice' || attributeType === 'lookup'
    ? 'in'
    : 'eq';
}

export function getDefaultValues(
  operator: OperatorOption,
  value: any,
  _attributeType: AttributeType
): any[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

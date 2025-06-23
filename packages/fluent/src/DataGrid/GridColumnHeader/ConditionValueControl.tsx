import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { useDataService } from '@headless-adminapp/app/transport';
import type {
  Attribute,
  AttributeType,
} from '@headless-adminapp/core/attributes';

import FormControl from '../../form/FormControl';

interface ConditionValueControlProps {
  attribute: Attribute;
  type: AttributeType;
  value: any;
  onChange?: (value: any) => void;
}

export function ConditionValueControl({
  attribute,
  type,
  value,
  onChange,
}: Readonly<ConditionValueControlProps>) {
  const dataService = useDataService();
  const { schemaStore, experienceStore } = useMetadata();

  switch (type) {
    case 'string':
      return (
        <FormControl
          type="text"
          value={value ?? null}
          onChange={(value) => {
            onChange?.(value);
          }}
        />
      );
    case 'number':
      return (
        <FormControl
          type="number"
          value={value ?? null}
          onChange={(value) => {
            onChange?.(value);
          }}
        />
      );
    case 'money':
      return (
        <FormControl
          type="currency"
          value={value ?? null}
          onChange={(value) => {
            onChange?.(value);
          }}
        />
      );
    case 'lookup':
      if (attribute.type !== 'lookup') {
        return null;
      }

      return (
        <FormControl
          type="lookups"
          async
          dataService={dataService}
          schema={schemaStore.getSchema(attribute.entity)}
          experienceStore={experienceStore}
          value={value ?? null}
          onChange={(value) => {
            onChange?.(value ?? []);
          }}
        />
      );
    case 'date':
      return (
        <FormControl
          type="date"
          value={value ?? null}
          onChange={(value) => {
            onChange?.(value);
          }}
        />
      );
    case 'boolean':
      if (attribute.type !== 'boolean') {
        return null;
      }

      return (
        <FormControl
          type="multi-select"
          options={[
            {
              label: attribute.trueLabel ?? 'Yes',
              value: 'true',
            },
            {
              label: attribute.falseLabel ?? 'No',
              value: 'false',
            },
          ]}
          value={value?.map((x: any) => (x === true ? 'true' : 'false')) ?? []}
          onChange={(value) => {
            onChange?.(value?.map((x: any) => x === 'true') ?? []);
          }}
        />
      );
    case 'choice':
    case 'choices': {
      if (attribute.type !== 'choice' && attribute.type !== 'choices') {
        return null;
      }

      const isNumeric = 'number' in attribute && attribute.number === true;

      return (
        <FormControl
          type="multi-select"
          options={attribute.options.map((x) => ({
            label: x.label,
            value: isNumeric ? x.value?.toString() : (x.value as string),
          }))}
          value={value?.map((x: any) => (isNumeric ? x.toString() : x)) ?? []}
          onChange={(value) => {
            onChange?.(value?.map((x: any) => (isNumeric ? +x : x)) ?? []);
          }}
        />
      );
    }
    default:
      return null;
  }
}

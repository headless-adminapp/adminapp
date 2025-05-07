import { Id } from '@headless-adminapp/core';
import { IdTypes } from '@headless-adminapp/core/attributes/IdAttribute';

import { IntegerControl } from './IntegerControl';
import { TextControl } from './TextControl';
import { ControlProps } from './types';

function formatGuid(value: string) {
  if (!value) {
    return '';
  }

  value = value.replace(/[^0-9a-fA-F]/g, '');

  const part1 = value.substring(0, 8);
  const part2 = value.substring(8, 12);
  const part3 = value.substring(12, 16);
  const part4 = value.substring(16, 20);
  const part5 = value.substring(20, 32);

  let formattedValue = '';

  formattedValue += part1;

  if (part2) {
    formattedValue += `-${part2}`;
  }

  if (part3) {
    formattedValue += `-${part3}`;
  }

  if (part4) {
    formattedValue += `-${part4}`;
  }

  if (part5) {
    formattedValue += `-${part5}`;
  }

  return formattedValue.toLowerCase();
}

function formatObjectId(value: string) {
  if (!value) {
    return '';
  }

  value = value.replace(/[^0-9a-fA-F]/g, '');

  return value.substring(0, 24).toLowerCase();
}

export interface IdControlProps extends ControlProps<Id> {
  idTypes: IdTypes;
}

export function IdControl({ idTypes, ...props }: Readonly<IdControlProps>) {
  if ('string' in idTypes && idTypes.string) {
    return <TextControl {...props} value={props.value as string} />;
  } else if ('number' in idTypes && idTypes.number) {
    return <IntegerControl {...props} value={props.value as number} />;
  } else if ('guid' in idTypes && idTypes.guid) {
    return (
      <TextControl
        {...props}
        maxLength={36}
        value={formatGuid(props.value as string)}
        onChange={(value) => {
          if (!value) {
            props.onChange?.(null);
          } else {
            props.onChange?.(formatGuid(value));
          }
        }}
      />
    );
  } else if ('objectId' in idTypes && idTypes.objectId) {
    return (
      <TextControl
        {...props}
        maxLength={24}
        value={props.value as string}
        onChange={(value) => {
          if (!value) {
            props.onChange?.(null);
          } else {
            props.onChange?.(formatObjectId(value));
          }
        }}
      />
    );
  }

  return (
    <TextControl
      {...props}
      value={props.value ? String(props.value) : null}
      onChange={() => {}}
      placeholder="Unsupported ID type"
      disabled
    />
  );
}

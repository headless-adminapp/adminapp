import { Schema } from '@headless-adminapp/core/schema';

let formDefaultParameters: {
  logicalName: string;
  values: Record<string, any>;
} | null = null;

export function getFormDefaultParameters(schema: Schema) {
  const _values = formDefaultParameters?.values;
  const _logicalName = formDefaultParameters?.logicalName;

  const schemaDefaultValues = Object.keys(schema.attributes).reduce(
    (acc, key) => {
      const attribute = schema.attributes[key];

      let defaultValue = attribute.default;

      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue();
      }

      if (defaultValue instanceof Date) {
        defaultValue = defaultValue.toISOString();
      }

      return {
        ...acc,
        [key]: defaultValue,
      };
    },
    {} as Record<string, any>
  );

  if (_logicalName === schema.logicalName) {
    return {
      ...schemaDefaultValues,
      ..._values,
    };
  }

  return schemaDefaultValues;
}

let defaultParamsTimeout: NodeJS.Timeout | null = null;

export function setFormDefaultParameters(
  logicalName: string,
  values: Record<string, any>
) {
  formDefaultParameters = {
    logicalName,
    values,
  };

  if (defaultParamsTimeout) {
    clearTimeout(defaultParamsTimeout);
  }

  defaultParamsTimeout = setTimeout(() => {
    formDefaultParameters = null;
  }, 5000);
}

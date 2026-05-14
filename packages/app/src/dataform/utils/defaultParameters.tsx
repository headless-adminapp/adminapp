import type { FormExperience } from '@headless-adminapp/core/experience/form';
import type { RouterInstance } from '@headless-adminapp/core/navigation';
import type { Schema } from '@headless-adminapp/core/schema';
import dayjs from 'dayjs';

interface DefaultParameters {
  logicalName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
}

export function getFormDefaultParameters(
  schema: Schema,
  formExperience: FormExperience,
  router: RouterInstance,
) {
  const _values =
    router.getState<DefaultParameters>('defaultParameters')?.values;
  const _logicalName =
    router.getState<DefaultParameters>('defaultParameters')?.logicalName;

  const schemaDefaultValues = Object.keys(schema.attributes).reduce(
    (acc, key) => {
      const attribute = schema.attributes[key];

      let defaultValue = attribute.default;

      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue();
      }

      if (defaultValue instanceof Date) {
        defaultValue = defaultValue.toISOString();
      } else if (attribute.type === 'date' && defaultValue === '@now') {
        if (attribute.format === 'date') {
          defaultValue = dayjs().format('YYYY-MM-DD');
        } else {
          defaultValue = new Date().toISOString();
        }
      }

      return {
        ...acc,
        [key]: defaultValue,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any>,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let formDefaultValues: Record<string, any> = {};

  if (typeof formExperience.defaultValues === 'function') {
    formDefaultValues = formExperience.defaultValues();
  } else if (typeof formExperience.defaultValues === 'object') {
    formDefaultValues = formExperience.defaultValues;
  }

  let defaultValues = {
    ...schemaDefaultValues,
    ...formDefaultValues,
  };

  if (_logicalName === schema.logicalName) {
    defaultValues = {
      ...defaultValues,
      ..._values,
    };
  }

  return defaultValues;
}

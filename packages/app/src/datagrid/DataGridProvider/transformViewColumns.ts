import { ViewColumn } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';

import { localizedLabel } from '../../locale/utils';
import { TransformedViewColumn } from '../context';

export function transformViewColumns<S extends SchemaAttributes>(
  logicalName: string,
  columns: ViewColumn<S>[],
  schemaStore: ISchemaStore,
  language: string,
): TransformedViewColumn<S>[] {
  const schema = schemaStore.getSchema(logicalName);

  return columns
    .map((column) => {
      const attribute = schema.attributes[column.name as string];

      if (!attribute) {
        return null;
      }

      const label = column.label ?? localizedLabel(language, attribute);

      if (column.expandedKey) {
        if (attribute.type !== 'lookup') {
          return null;
        }

        const lookupSchema = schemaStore.getSchema(attribute.entity);
        const lookupAttribute = lookupSchema.attributes[column.expandedKey];

        if (!lookupAttribute) {
          return null;
        }

        const lookupLabel = localizedLabel(language, lookupAttribute);

        return {
          ...column,
          id: `${column.name as string}.${column.expandedKey}`,
          label: column.label ?? `${lookupLabel} (${label})`,
        };
      }

      return {
        ...column,
        id: column.name as string,
        label: label,
      };
    })
    .filter(Boolean) as unknown as TransformedViewColumn<S>[];
}

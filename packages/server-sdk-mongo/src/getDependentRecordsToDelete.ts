import {
  LookupAttribute,
  LookupBehavior,
} from '@headless-adminapp/core/attributes';
import { RegardingAttribute } from '@headless-adminapp/core/attributes/LookupAttribute';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { ConflictError } from '@headless-adminapp/core/transport';
import { DependentRecord } from '@headless-adminapp/server-sdk';
import { ClientSession } from 'mongoose';

import { MongoSchemaStore } from './MongoSchemaStore';
import { MongoRequiredSchemaAttributes } from './types';

export function getDependedAttributes<
  SA extends SchemaAttributes = SchemaAttributes,
>(schema: Schema<SA>, schemaStore: ISchemaStore<SA>) {
  const allSchemas = Object.values(schemaStore.getAllSchema());

  const dependedAttributes: Array<{
    attributeName: string;
    schemaLogicalName: string;
    behavior?: LookupBehavior;
    entityTypeAttribute?: string;
  }> = allSchemas
    .map((x) => {
      const allAttributes = Object.entries(x.attributes);

      const lookupAttributes = allAttributes.filter(
        ([, attribute]) =>
          attribute.type === 'lookup' &&
          attribute.entity === schema.logicalName,
      ) as [string, LookupAttribute][];

      const regardingAttributes = allAttributes.filter(
        ([, attribute]) =>
          attribute.type === 'regarding' &&
          attribute.entities.includes(schema.logicalName),
      ) as [string, RegardingAttribute][];

      return [
        ...lookupAttributes.map(([key, attribute]) => ({
          attributeName: key,
          schemaLogicalName: x.logicalName,
          behavior: attribute.behavior as LookupBehavior,
        })),
        ...regardingAttributes.map(([key, attribute]) => ({
          attributeName: key,
          schemaLogicalName: x.logicalName,
          behavior: 'reference' as LookupBehavior,
          entityTypeAttribute: attribute.entityTypeAttribute,
        })),
      ];
    })
    .flat();

  return dependedAttributes;
}

export async function getDependentRecordsToDelete<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
>({
  _id,
  schema,
  session,
  schemaStore,
}: {
  schema: Schema<SA>;
  _id: unknown;
  session: ClientSession | null;
  schemaStore: MongoSchemaStore<SA>;
}) {
  const dependedAttributes = getDependedAttributes(schema, schemaStore);

  const dependedRecordsResult: DependentRecord[] = [];

  for (const {
    attributeName,
    schemaLogicalName,
    behavior,
    entityTypeAttribute,
  } of dependedAttributes) {
    const schema = schemaStore.getSchema(schemaLogicalName);

    if (schema.virtual) {
      // We only check for direct dependencies
      // so we can skip virtual schemas as they don't have their own collection
      continue;
    }

    const dependedModel = schemaStore.getModel(schemaLogicalName);

    const filter: Record<string, any> = {
      [attributeName]: _id,
    };

    if (entityTypeAttribute) {
      filter[entityTypeAttribute] = schema.logicalName;
    }

    const dependedRecords = await dependedModel.find(filter, undefined, {
      session,
    });

    if (!dependedRecords.length) {
      continue;
    }

    if (behavior === 'dependent') {
      dependedRecordsResult.push(
        ...dependedRecords.map((record: any) => ({
          logicalName: schemaLogicalName,
          id: record._id,
          record,
        })),
      );
      continue;
    }

    throw new ConflictError('Record is being used in another record');
  }

  return dependedRecordsResult;
}

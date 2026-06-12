import { defineSchema } from '@headless-adminapp/core/schema/utils';
import { describe, expect, it } from 'vitest';

import { LookupPipelineBuilder } from './LookupPipelineBuilder';
import { MongoSchemaStore } from './MongoSchemaStore';
import type { MongoRequiredSchemaAttributes } from './types';

describe('LookupPipelineBuilder', () => {
  const schema1 = defineSchema<MongoRequiredSchemaAttributes>({
    label: '',
    logicalName: 'schema1',
    primaryAttribute: 'name',
    idAttribute: '_id',
    pluralLabel: '',
    attributes: {
      _id: { type: 'id', label: 'Id', objectId: true, required: true },
      name: { type: 'string', label: 'Name', format: 'text', required: true },
      lookup: {
        type: 'lookup',
        label: 'Lookup',
        entity: 'schema2',
        objectId: true,
      },
      regarding: {
        type: 'regarding',
        label: 'Regarding',
        objectId: true,
        entities: ['schema2'],
        entityTypeAttribute: 'regarding_entity_type',
      },
      regarding_entity_type: {
        type: 'string',
        label: 'Regarding Entity Type',
        format: 'text',
      },
    },
  });
  const schema2 = defineSchema<MongoRequiredSchemaAttributes>({
    label: '',
    logicalName: 'schema2',
    primaryAttribute: 'name',
    idAttribute: '_id',
    pluralLabel: '',
    attributes: {
      _id: { type: 'id', label: 'Id', objectId: true, required: true },
      name: { type: 'string', label: 'Name', format: 'text', required: true },
      nestedLookup: {
        type: 'lookup',
        label: 'Nested Lookup',
        entity: 'schema3',
        objectId: true,
      },
      nestedRegarding: {
        type: 'regarding',
        label: 'Nested Regarding',
        objectId: true,
        entities: ['schema3'],
        entityTypeAttribute: 'nested_regarding_entity_type',
      },
      nested_regarding_entity_type: {
        type: 'string',
        label: 'Nested Regarding Entity Type',
        format: 'text',
      },
    },
  });
  const schema3 = defineSchema<MongoRequiredSchemaAttributes>({
    label: '',
    logicalName: 'schema3',
    primaryAttribute: 'name',
    idAttribute: '_id',
    pluralLabel: '',
    attributes: {
      _id: { type: 'id', label: 'Id', objectId: true, required: true },
      name: { type: 'string', label: 'Name', format: 'text', required: true },
    },
  });
  const schemaStore = new MongoSchemaStore();
  schemaStore.register(schema1);
  schemaStore.register(schema2);
  schemaStore.register(schema3);

  it('should build a lookup pipeline correctly', () => {
    const builder = new LookupPipelineBuilder({
      columns: ['_id', 'name', 'lookup'],
      includeSearchable: true,
      schema: schema1,
      schemaStore,
      expand: {
        lookup: {
          columns: ['_id', 'name'],
          expand: {
            nestedLookup: ['_id', 'name'],
          },
        },
      },
    });

    const pipeline = builder.build();

    expect(pipeline).toEqual([
      {
        $lookup: {
          as: '@expand.lookup.schema2',
          foreignField: '_id',
          from: 'schema2',
          localField: 'lookup',
        },
      },
      {
        $unwind: {
          path: '$@expand.lookup.schema2',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          as: '@expand.lookup.schema2.@expand.nestedLookup.schema3',
          foreignField: '_id',
          from: 'schema3',
          localField: 'nestedLookup',
        },
      },
      {
        $unwind: {
          path: '$@expand.lookup.schema2.@expand.nestedLookup.schema3',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  });

  it.only('should include lookup from nested expand', () => {
    const builder = new LookupPipelineBuilder({
      columns: ['_id', 'name', 'lookup'],
      includeSearchable: true,
      schema: schema1,
      schemaStore,
      expand: {
        lookup: ['_id', 'name', 'nestedLookup'],
      },
    });

    const pipeline = builder.build();

    expect(pipeline).toEqual([
      {
        $lookup: {
          as: '@expand.lookup.schema2',
          foreignField: '_id',
          from: 'schema2',
          localField: 'lookup',
        },
      },
      {
        $unwind: {
          path: '$@expand.lookup.schema2',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          as: '@expand.lookup.schema2.@expand.nestedLookup.schema3',
          foreignField: '_id',
          from: 'schema3',
          localField: 'nestedLookup',
        },
      },
      {
        $unwind: {
          path: '$@expand.lookup.schema2.@expand.nestedLookup.schema3',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  });
});

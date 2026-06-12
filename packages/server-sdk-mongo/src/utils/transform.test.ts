/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema } from '@headless-adminapp/core/schema';
import { defineSchema } from '@headless-adminapp/core/schema/utils';
import { SchemaStore } from '@headless-adminapp/core/store';
import { beforeEach, describe, expect, it } from 'vitest';

import { transformRecord } from './transform';

describe('transform', () => {
  describe('transformRecord', () => {
    const schema1 = defineSchema({
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
    }) as unknown as Schema;
    const schema2 = defineSchema({
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
    }) as unknown as Schema;
    const schema3 = defineSchema({
      label: '',
      logicalName: 'schema3',
      primaryAttribute: 'name',
      idAttribute: '_id',
      pluralLabel: '',
      attributes: {
        _id: { type: 'id', label: 'Id', objectId: true, required: true },
        name: { type: 'string', label: 'Name', format: 'text', required: true },
      },
    }) as unknown as Schema;
    const schemaStore = new SchemaStore();
    schemaStore.register(schema1);
    schemaStore.register(schema2);
    schemaStore.register(schema3);

    let record: Record<string, any> = {};

    beforeEach(() => {
      // Reset transformedRecord and record before each test
      record = {
        _id: '1',
        name: 'Test',
        lookup: '2',
        regarding: '3',
        '@expand': {
          lookup: {
            schema2: {
              _id: '2',
              name: 'Lookup Test',
              '@expand': {
                nestedLookup: {
                  schema3: {
                    _id: '4',
                    name: 'Nested Lookup Test',
                  },
                },
              },
            },
          },
        },
      };
    });

    it('should transform columns correctly', () => {
      const transformedRecord = transformRecord({
        columns: ['_id', 'name', 'lookup'],
        record,
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

      expect(transformedRecord).toEqual({
        $entity: 'schema1',
        _id: '1',
        name: 'Test',
        lookup: {
          id: '2',
          name: 'Lookup Test',
          avatar: null,
          logicalName: 'schema2',
        },
        $expand: {
          lookup: {
            schema2: {
              $entity: 'schema2',
              _id: '2',
              name: 'Lookup Test',
              $expand: {
                nestedLookup: {
                  schema3: {
                    $entity: 'schema3',
                    _id: '4',
                    name: 'Nested Lookup Test',
                  },
                },
              },
            },
          },
        },
      });
    });
  });
});

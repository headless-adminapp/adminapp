import { defineSchema } from '@headless-adminapp/core/schema/utils';
import { describe, expect, it } from 'vitest';

import { defineModel } from './defineModel';

describe('defineModel', () => {
  it('should define a model with correct schema', () => {
    const schema = defineSchema({
      logicalName: 'test_models',
      label: 'Test Model',
      pluralLabel: 'Test Models',
      primaryAttribute: 'name',
      idAttribute: '_id',
      createdAtAttribute: 'createdAt',
      updatedAtAttribute: 'updatedAt',
      attributes: {
        _id: {
          type: 'id',
          objectId: true,
          label: 'ID',
          required: true,
        },
        name: {
          type: 'string',
          format: 'text',
          label: 'Name',
          required: true,
        },
        createdAt: {
          type: 'date',
          format: 'datetime',
          default: '@now',
          label: 'Created At',
        },
        updatedAt: {
          type: 'date',
          format: 'datetime',
          default: '@now',
          label: 'Updated At',
        },
        isDisabled: {
          type: 'boolean',
          label: 'Is Disabled',
        },
        dob: {
          type: 'date',
          format: 'date',
          label: 'Date of Birth',
        },
        age: {
          type: 'number',
          format: 'integer',
          label: 'Age',
        },
        amount: {
          type: 'money',
          label: 'Amount',
        },
        category: {
          type: 'choice',
          label: 'Category',
          string: true,
          options: [],
        },
        tags: {
          type: 'choices',
          label: 'Tags',
          string: true,
          options: [],
        },
        parent: {
          type: 'lookup',
          label: 'Parent',
          objectId: true,
          entity: 'test_models',
        },
        attachment: {
          type: 'attachment',
          format: 'any',
          label: 'Attachment',
        },
        detail: {
          type: 'mixed',
          label: 'Detail',
        },
        drange: {
          type: 'daterange',
          label: 'Date Range',
        },
        parents: {
          type: 'lookups',
          label: 'Parents',
          objectId: true,
          entity: 'test_models',
        },
        customId: {
          type: 'id',
          string: true,
          label: 'Custom ID',
        },
      },
    });

    const model = defineModel('TestModel', schema);

    expect(model).toBeDefined();
    expect(model.modelName).toBe('TestModel');
    expect(model.schema).toBeDefined();
    expect(model.schema.paths).toHaveProperty('_id');
    expect(model.schema.paths._id.instance).toBe('ObjectId');

    expect(model.schema.paths.name).toBeDefined();
    expect(model.schema.paths.name.instance).toBe('String');
    expect(model.schema.paths.createdAt).toBeDefined();
    expect(model.schema.paths.createdAt.instance).toBe('Date');
    expect(model.schema.paths.updatedAt).toBeDefined();
    expect(model.schema.paths.updatedAt.instance).toBe('Date');

    expect(model.schema.paths.isDisabled).toBeDefined();
    expect(model.schema.paths.isDisabled.instance).toBe('Boolean');
    expect(model.schema.paths.dob).toBeDefined();
    expect(model.schema.paths.dob.instance).toBe('Date');
    expect(model.schema.paths.age).toBeDefined();
    expect(model.schema.paths.age.instance).toBe('Number');
    expect(model.schema.paths.amount).toBeDefined();
    expect(model.schema.paths.amount.instance).toBe('Number');
    expect(model.schema.paths.category).toBeDefined();
    expect(model.schema.paths.category.instance).toBe('String');
    expect(model.schema.paths.tags).toBeDefined();
    expect(model.schema.paths.tags.instance).toBe('Array');
    expect(model.schema.paths.parent).toBeDefined();
    expect(model.schema.paths.parent.instance).toBe('ObjectId');
    expect(model.schema.paths.attachment).toBeDefined();
    expect(model.schema.paths.attachment.instance).toBe('String');
    expect(model.schema.paths.detail).toBeDefined();
    expect(model.schema.paths.detail.instance).toBe('Mixed');
    expect(model.schema.paths.drange).toBeDefined();
    expect(model.schema.paths.drange.instance).toBe('Mixed');
    expect(model.schema.paths.parents).toBeDefined();
    expect(model.schema.paths.parents.instance).toBe('Mixed');
    expect(model.schema.paths.customId).toBeDefined();
    expect(model.schema.paths.customId.instance).toBe('String');
  });
});

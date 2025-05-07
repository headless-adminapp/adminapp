import {
  ChoiceAttribute,
  Id,
  IdAttribute,
  LookupAttribute,
} from '@headless-adminapp/core/attributes';
import { AttributeBase } from '@headless-adminapp/core/attributes/AttributeBase';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import { IdTypes } from '@headless-adminapp/core/attributes/IdAttribute';
import { Schema } from '@headless-adminapp/core/schema';
import { Model, model, models, Schema as MongoSchema } from 'mongoose';

import { InferredDbSchemaType, MongoRequiredSchemaAttributes } from './types';

function resolveChoiceAttribute(attribute: ChoiceAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: MongoSchema.Types.String };
  } else if ('number' in attribute && attribute.number) {
    return { type: MongoSchema.Types.Number };
  } else {
    throw new Error('Invalid choice type');
  }
}

function resolveChoicesAttribute(attribute: ChoicesAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: [MongoSchema.Types.String] };
  } else if ('number' in attribute && attribute.number) {
    return { type: [MongoSchema.Types.Number] };
  } else {
    throw new Error('Invalid choice type');
  }
}

function resolveIdType(idType: IdTypes) {
  if ('string' in idType && idType.string) {
    return MongoSchema.Types.String;
  } else if ('number' in idType && idType.number) {
    return MongoSchema.Types.Number;
  } else if ('objectId' in idType && idType.objectId) {
    return MongoSchema.Types.ObjectId;
  } else if ('guid' in idType && idType.guid) {
    return MongoSchema.Types.String;
  }

  throw new Error('Invalid id type');
}

function resolveIdAttribute(attribute: IdAttribute<Id>) {
  return { type: resolveIdType(attribute) };
}

function resolveLookupAttribute(attribute: LookupAttribute) {
  return {
    type: resolveIdType(attribute),
    ref: attribute.entity,
  };
}

function applyDefaultAttribute(attribute: AttributeBase, defination: any) {
  if (attribute.default && typeof attribute.default !== 'function') {
    defination.default = attribute.default;
  }
}

function applyRequiredAttribute(attribute: AttributeBase, _defination: any) {
  if (attribute.required) {
    // acc[key].required = rest[key].required;
  }
}

export function defineModel<S extends MongoRequiredSchemaAttributes>(
  name: string,
  schema: Schema<S>
) {
  if (!models[name]) {
    const { _id, ...rest } = schema.attributes;

    const defination = Object.keys(rest).reduce((acc, key) => {
      const attribute = rest[key];

      if (
        schema.createdAtAttribute === key ||
        schema.updatedAtAttribute === key
      ) {
        // Skip createdAt and updatedAt attributes
        return acc;
      }

      switch (attribute.type) {
        case 'id':
          acc[key] = resolveIdAttribute(attribute);
          break;
        case 'attachment':
        case 'string':
          acc[key] = { type: MongoSchema.Types.String };
          break;
        case 'boolean':
          acc[key] = { type: MongoSchema.Types.Boolean };
          break;
        case 'date':
          acc[key] = { type: MongoSchema.Types.Date };
          break;
        case 'choice':
          acc[key] = resolveChoiceAttribute(attribute);
          break;
        case 'choices':
          acc[key] = resolveChoicesAttribute(attribute);
          break;
        case 'lookup':
          acc[key] = resolveLookupAttribute(attribute);
          break;
        case 'mixed':
          acc[key] = { type: MongoSchema.Types.Mixed };
          break;
        case 'money':
        case 'number':
          acc[key] = { type: MongoSchema.Types.Number };
          break;
        case 'daterange':
        case 'lookups':
          acc[key] = { type: MongoSchema.Types.Mixed };
          break;
        default:
          return acc;
      }

      applyDefaultAttribute(attribute, acc[key]);
      applyRequiredAttribute(attribute, acc[key]);

      return acc;
    }, {} as Record<string, any>);

    if (!('objectId' in _id)) {
      defination._id = resolveIdAttribute(_id);
    }

    const mongoSchema = new MongoSchema(defination, {
      timestamps: {
        createdAt: !!schema.createdAtAttribute,
        updatedAt: !!schema.updatedAtAttribute,
      },
      autoCreate: !schema.virtual, // Don't create a collection for virtual schemas
    });

    models[name] = model<InferredDbSchemaType<S>>(
      name,
      mongoSchema,
      schema.collectionName ?? schema.logicalName
    );
  }

  return models[name] as Model<InferredDbSchemaType<S>, {}, {}, {}, any>;
}

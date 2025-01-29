import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { AttributeBase } from '@headless-adminapp/core/attributes/AttributeBase';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
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
  schema: Schema<S>
) {
  if (!models[schema.logicalName]) {
    const { _id, ...rest } = schema.attributes;

    const mongoSchema = new MongoSchema(
      Object.keys(rest).reduce((acc, key) => {
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
            acc[key] = { type: MongoSchema.Types.ObjectId };
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
            acc[key] = {
              type: MongoSchema.Types.ObjectId,
              ref: attribute.entity,
            };
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
      }, {} as Record<string, any>),
      {
        timestamps: {
          createdAt: !!schema.createdAtAttribute,
          updatedAt: !!schema.updatedAtAttribute,
        },
      }
    );

    models[schema.logicalName] = model<InferredDbSchemaType<S>>(
      schema.logicalName,
      mongoSchema,
      schema.logicalName
    );
  }

  return models[schema.logicalName] as Model<
    InferredDbSchemaType<S>,
    {},
    {},
    {},
    any
  >;
}

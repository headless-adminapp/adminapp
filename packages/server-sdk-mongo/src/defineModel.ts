import { Schema } from '@headless-adminapp/core/schema';
import { Model, model, models, Schema as MongoSchema } from 'mongoose';

import { InferredDbSchemaType, MongoRequiredSchemaAttributes } from './types';

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
            if ('string' in attribute && attribute.string) {
              acc[key] = { type: MongoSchema.Types.String };
            } else if ('number' in attribute && attribute.number) {
              acc[key] = { type: MongoSchema.Types.Number };
            } else {
              throw new Error('Invalid choice type');
            }
            break;
          case 'choices':
            if ('string' in attribute && attribute.string) {
              acc[key] = { type: [MongoSchema.Types.String] };
            } else if ('number' in attribute && attribute.number) {
              acc[key] = { type: [MongoSchema.Types.Number] };
            } else {
              throw new Error('Invalid choice type');
            }
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

        if (rest[key].default && typeof rest[key].default !== 'function') {
          acc[key].default = rest[key].default;
        }

        if (rest[key].required) {
          // acc[key].required = rest[key].required;
        }

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

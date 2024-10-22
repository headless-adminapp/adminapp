import { Schema } from '@headless-adminapp/core/schema';
import { DataTypes, Sequelize } from 'sequelize';

import { SequelizeRequiredSchemaAttributes } from './types';

export function defineModel<S extends SequelizeRequiredSchemaAttributes>(
  schema: Schema<S>,
  sequelize: Sequelize
) {
  if (!sequelize.models[schema.logicalName]) {
    const attributes = schema.attributes;

    const sequelizeSchema = Object.keys(attributes).reduce((acc, key) => {
      const attribute = attributes[key];

      if (
        schema.createdAtAttribute === key ||
        schema.updatedAtAttribute === key
      ) {
        // Skip createdAt and updatedAt attributes
        return acc;
      }

      switch (attribute.type) {
        case 'id':
          acc[key] = {
            type: DataTypes.STRING,
            primaryKey: schema.idAttribute === key,
          };
          break;
        case 'attachment':
        case 'string':
          acc[key] = { type: DataTypes.STRING };
          break;
        case 'boolean':
          acc[key] = { type: DataTypes.BOOLEAN };
          break;
        case 'date':
          acc[key] = { type: DataTypes.DATEONLY };
          break;
        case 'choice':
          if ('string' in attribute && attribute.string) {
            acc[key] = { type: DataTypes.STRING };
          } else if ('number' in attribute && attribute.number) {
            acc[key] = { type: DataTypes.NUMBER };
          } else {
            throw new Error('Invalid choice type');
          }
          break;
        case 'choices':
          if ('string' in attribute && attribute.string) {
            acc[key] = { type: [DataTypes.STRING] };
          } else if ('number' in attribute && attribute.number) {
            acc[key] = { type: [DataTypes.NUMBER] };
          } else {
            throw new Error('Invalid choice type');
          }
          break;
        case 'lookup':
          acc[key] = {
            type: DataTypes.STRING,
            // ref: attribute.entity,
          };
          break;
        case 'mixed':
          acc[key] = { type: DataTypes.JSONB };
          break;
        default:
          return acc;
      }

      if (attribute.default && typeof attribute.default !== 'function') {
        acc[key].default = attribute.default;
      }

      if (attribute.required) {
        // acc[key].required = rest[key].required;
      }

      acc[key].allowNull = true;

      return acc;
    }, {} as Record<string, any>);

    sequelize.models[schema.logicalName] = sequelize.define(
      schema.logicalName,
      sequelizeSchema,
      {
        createdAt: schema.createdAtAttribute
          ? (schema.createdAtAttribute as string)
          : false,
        updatedAt: schema.updatedAtAttribute
          ? (schema.updatedAtAttribute as string)
          : false,
        freezeTableName: true,
        tableName: schema.logicalName,
      }
    );
  }

  return sequelize.models[schema.logicalName];
}

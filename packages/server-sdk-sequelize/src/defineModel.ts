import {
  ChoiceAttribute,
  DateAttribute,
  IdAttribute,
} from '@headless-adminapp/core/attributes';
import { AttributeBase } from '@headless-adminapp/core/attributes/AttributeBase';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import { Schema } from '@headless-adminapp/core/schema';
import { DataTypes, ModelAttributeColumnOptions, Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

import { SequelizeRequiredSchemaAttributes } from './types';

function resolveDateAttribute(attribute: DateAttribute) {
  if (attribute.format === 'datetime') {
    return { type: DataTypes.DATE };
  } else {
    return { type: DataTypes.DATEONLY };
  }
}

function resolveChoiceAttribute(attribute: ChoiceAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: DataTypes.STRING };
  } else if ('number' in attribute && attribute.number) {
    return { type: DataTypes.NUMBER };
  }

  throw new Error('Invalid choice type');
}

function resolveChoicesAttribute(attribute: ChoicesAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: [DataTypes.STRING] };
  } else if ('number' in attribute && attribute.number) {
    return { type: [DataTypes.NUMBER] };
  }

  throw new Error('Invalid choice type');
}

function resolveIdAttribute(
  attribute: IdAttribute<string | number>,
  isSchemaIdAttribute: boolean
): ModelAttributeColumnOptions {
  const modelAttribute = {
    primaryKey: isSchemaIdAttribute,
  } as ModelAttributeColumnOptions;

  if ('number' in attribute && attribute.number) {
    modelAttribute.type = DataTypes.NUMBER;

    if (isSchemaIdAttribute) {
      modelAttribute.autoIncrement = true;
    }
  } else {
    modelAttribute.type = DataTypes.STRING;

    if (isSchemaIdAttribute) {
      if ('guid' in attribute && attribute.guid) {
        modelAttribute.type = DataTypes.UUID;
        modelAttribute.defaultValue = () => uuid();
      } else {
        throw new Error('Invalid type for id attribute');
      }
    }
  }

  return modelAttribute;
}

function shouldSkipAttribute<S extends SequelizeRequiredSchemaAttributes>(
  key: string,
  schema: Schema<S>
) {
  if (schema.createdAtAttribute === key || schema.updatedAtAttribute === key) {
    // Skip createdAt and updatedAt attributes
    return true;
  }

  return false;
}

function applyDefaultAttribute(attribute: AttributeBase, defination: any) {
  if (attribute.default && typeof attribute.default !== 'function') {
    defination.default = attribute.default;
  }
}

function applyRequiredAttribute(attribute: AttributeBase, defination: any) {
  if (attribute.required) {
    // acc[key].required = rest[key].required;
  }

  defination.allowNull = true;
}

function _defineModel<S extends SequelizeRequiredSchemaAttributes>(
  schema: Schema<S>,
  sequelize: Sequelize
) {
  const attributes = schema.attributes;

  const sequelizeSchema = Object.keys(attributes).reduce((acc, key) => {
    const attribute = attributes[key];

    if (shouldSkipAttribute(key, schema)) {
      // Skip createdAt and updatedAt attributes
      return acc;
    }

    switch (attribute.type) {
      case 'id':
        acc[key] = resolveIdAttribute(attribute, schema.idAttribute === key);
        break;
      case 'attachment':
      case 'string':
        acc[key] = { type: DataTypes.STRING };
        break;
      case 'boolean':
        acc[key] = { type: DataTypes.BOOLEAN };
        break;
      case 'date':
        acc[key] = resolveDateAttribute(attribute);
        break;
      case 'number':
        acc[key] = { type: DataTypes.NUMBER };
        break;
      case 'money':
        acc[key] = { type: DataTypes.NUMBER };
        break;
      case 'choice':
        acc[key] = resolveChoiceAttribute(attribute);
        break;
      case 'choices':
        acc[key] = resolveChoicesAttribute(attribute);
        break;
      case 'lookup':
        acc[key] = {
          type: DataTypes.STRING,
        };
        break;
      case 'mixed':
        acc[key] = { type: DataTypes.JSONB };
        break;
      default:
        return acc;
    }

    applyDefaultAttribute(attribute, acc[key]);
    applyRequiredAttribute(attribute, acc[key]);

    return acc;
  }, {} as Record<string, any>);

  return sequelize.define(schema.logicalName, sequelizeSchema, {
    createdAt: schema.createdAtAttribute
      ? (schema.createdAtAttribute as string)
      : false,
    updatedAt: schema.updatedAtAttribute
      ? (schema.updatedAtAttribute as string)
      : false,
    freezeTableName: true,
    tableName: schema.logicalName,
  });
}

export function defineModel<S extends SequelizeRequiredSchemaAttributes>(
  schema: Schema<S>,
  sequelize: Sequelize
) {
  if (!sequelize.models[schema.logicalName]) {
    sequelize.models[schema.logicalName] = _defineModel(schema, sequelize);
  }

  return sequelize.models[schema.logicalName];
}

import {
  ChoiceAttribute,
  DateAttribute,
  IdAttribute,
  LookupAttribute,
  NumberAttribute,
  StringAttribute,
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

function resolveNumberAttribute(attribute: NumberAttribute) {
  if (attribute.format === 'decimal') {
    return { type: DataTypes.FLOAT };
  }

  return { type: DataTypes.INTEGER };
}

function resolveChoiceAttribute(attribute: ChoiceAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: DataTypes.STRING };
  } else if ('number' in attribute && attribute.number) {
    return { type: DataTypes.INTEGER };
  }

  throw new Error('Invalid choice type');
}

function resolveChoicesAttribute(attribute: ChoicesAttribute<string | number>) {
  if ('string' in attribute && attribute.string) {
    return { type: [DataTypes.STRING] };
  } else if ('number' in attribute && attribute.number) {
    return { type: [DataTypes.INTEGER] };
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
    modelAttribute.type = DataTypes.INTEGER;

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

function resolveLookupAttribute(attribute: LookupAttribute) {
  const modelAttribute = {} as ModelAttributeColumnOptions;

  if ('number' in attribute && attribute.number) {
    modelAttribute.type = DataTypes.INTEGER;
  } else {
    modelAttribute.type = DataTypes.STRING;

    if ('guid' in attribute && attribute.guid) {
      modelAttribute.type = DataTypes.UUID;
    } else {
      modelAttribute.type = DataTypes.STRING;
    }
  }

  return modelAttribute;
}

function resolveStringAttribute(attribute: StringAttribute) {
  if (attribute.format === 'textarea' || attribute.format === 'richtext') {
    return { type: DataTypes.TEXT };
  }

  return { type: DataTypes.STRING };
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
  name: string,
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
        acc[key] = { type: DataTypes.STRING };
        break;
      case 'string':
        acc[key] = resolveStringAttribute(attribute);
        break;
      case 'boolean':
        acc[key] = { type: DataTypes.BOOLEAN };
        break;
      case 'date':
        acc[key] = resolveDateAttribute(attribute);
        break;
      case 'number':
        acc[key] = resolveNumberAttribute(attribute);
        break;
      case 'money':
        acc[key] = { type: DataTypes.FLOAT };
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
        acc[key] = { type: DataTypes.JSONB };
        break;
      default:
        return acc;
    }

    applyDefaultAttribute(attribute, acc[key]);
    applyRequiredAttribute(attribute, acc[key]);

    return acc;
  }, {} as Record<string, any>);

  return sequelize.define(name, sequelizeSchema, {
    createdAt: schema.createdAtAttribute
      ? (schema.createdAtAttribute as string)
      : false,
    updatedAt: schema.updatedAtAttribute
      ? (schema.updatedAtAttribute as string)
      : false,
    freezeTableName: true,
    tableName: schema.collectionName ?? schema.logicalName,
  });
}

export function defineModel<S extends SequelizeRequiredSchemaAttributes>(
  name: string,
  schema: Schema<S>,
  sequelize: Sequelize
) {
  if (!sequelize.models[name]) {
    sequelize.models[name] = _defineModel(name, schema, sequelize);
  }

  return sequelize.models[name];
}

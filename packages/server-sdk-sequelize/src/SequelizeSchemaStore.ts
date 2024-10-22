import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { SchemaStore } from '@headless-adminapp/core/store';
import { Model, ModelStatic, Sequelize } from 'sequelize';

import { defineModel } from './defineModel';

const RELATION_ALIAS_PREFIX = '$expand';

interface SequelizeSchemaStoreOptions {
  sequelize: Sequelize;
}

export class SequelizeSchemaStore<
  SA extends SchemaAttributes = SchemaAttributes
> extends SchemaStore<SA> {
  private models: Record<string, ModelStatic<Model<any, any>>> = {};

  constructor(private readonly options: SequelizeSchemaStoreOptions) {
    super();
  }

  public override register<S extends SA>(schema: Schema<S>) {
    super.register(schema);

    const model = defineModel(schema, this.options.sequelize);

    this.models[schema.logicalName] = model as unknown as ModelStatic<
      Model<any, any>
    >;
  }

  public getModel<_S extends SA>(
    logicalName: string
  ): ModelStatic<Model<any, any>> {
    if (!this.models[logicalName]) {
      throw new Error(`Model for ${logicalName} not found`);
    }

    return this.models[logicalName] as unknown as ModelStatic<Model<any, any>>;
  }

  public getRelationAlias(
    logicalName: string,
    field: string,
    targetLogicalName: string
  ) {
    return `${RELATION_ALIAS_PREFIX}:${logicalName}:${field}:${targetLogicalName}`;
  }

  public ensureRelations() {
    const models = Object.values(this.models);

    for (const model of models) {
      const schema = this.getSchema(model.name);

      const attributes = schema.attributes;

      for (const [key, attribute] of Object.entries(attributes)) {
        if (attribute.type !== 'lookup') {
          continue;
        }

        const targetSchema = this.getSchema(attribute.entity);

        const targetModel = this.getModel(targetSchema.logicalName);

        model.belongsTo(targetModel, {
          as: this.getRelationAlias(
            schema.logicalName,
            key,
            targetSchema.logicalName
          ),
          foreignKey: key,
          onDelete: attribute.behavior === 'dependent' ? 'RESTRICT' : undefined,
        });
      }
    }
  }
}

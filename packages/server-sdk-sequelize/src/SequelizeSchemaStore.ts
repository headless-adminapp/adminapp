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

    const model = defineModel(
      schema.collectionName ?? schema.logicalName,
      schema,
      this.options.sequelize
    );

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
    collectionName: string,
    field: string,
    targetCollectionName: string
  ) {
    return `${RELATION_ALIAS_PREFIX}:${collectionName}:${field}:${targetCollectionName}`;
  }

  public ensureRelations() {
    const models = Object.entries(this.models);

    for (const [logicalName, model] of models) {
      const schema = this.getSchema(logicalName);

      const attributes = schema.attributes;

      for (const [key, attribute] of Object.entries(attributes)) {
        if (attribute.type !== 'lookup') {
          continue;
        }

        const targetSchema = this.getSchema(attribute.entity);

        const targetModel = this.getModel(targetSchema.logicalName);

        model.belongsTo(targetModel, {
          as: this.getRelationAlias(
            schema.collectionName ?? schema.logicalName,
            key,
            targetSchema.collectionName ?? targetSchema.logicalName
          ),
          foreignKey: key,
          onDelete: attribute.behavior === 'dependent' ? 'RESTRICT' : undefined,
        });
      }
    }
  }
}

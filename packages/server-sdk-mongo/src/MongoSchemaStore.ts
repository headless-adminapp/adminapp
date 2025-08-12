import { Schema } from '@headless-adminapp/core/schema';
import { SchemaStore } from '@headless-adminapp/core/store';
import { Model } from 'mongoose';

import { defineModel } from './defineModel';
import { InferredDbSchemaType, MongoRequiredSchemaAttributes } from './types';

export class MongoSchemaStore<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes
> extends SchemaStore<SA> {
  private models: Record<
    string,
    Model<InferredDbSchemaType<MongoRequiredSchemaAttributes>>
  > = {};

  constructor(private readonly key: string = 'MongoSchemaStore') {
    super();
  }

  public override register<S extends SA>(schema: Schema<S>) {
    super.register(schema);

    const model = defineModel(
      `${this.key}:${schema.logicalName}`,
      schema,
      (logicalName: string) => `${this.key}:${logicalName}`
    );

    this.models[schema.logicalName] = model as unknown as Model<
      InferredDbSchemaType<MongoRequiredSchemaAttributes>
    >;
  }

  public getModel<S extends SA>(
    logicalName: string
  ): Model<InferredDbSchemaType<S>> {
    if (!this.models[logicalName]) {
      throw new Error(`Model for ${logicalName} not found`);
    }

    return this.models[logicalName] as unknown as Model<
      InferredDbSchemaType<S>
    >;
  }
}

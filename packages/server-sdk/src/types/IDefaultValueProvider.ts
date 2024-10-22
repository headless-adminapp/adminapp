import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

export interface GetDefaultValuesParams<
  SA extends SchemaAttributes = SchemaAttributes
> {
  data: Record<string, any>;
  schema: Schema<SA>;
}

export type GetDefaultValuesResult = [Record<string, any>, Record<string, any>];

export interface IDefaultValueProvider<
  SA extends SchemaAttributes = SchemaAttributes
> {
  getDefaultValues<T extends GetDefaultValuesParams<SA>>(
    params: T
  ): GetDefaultValuesResult;
}

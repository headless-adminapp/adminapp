import type { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

export interface GetDefaultValuesParams<
  SA extends SchemaAttributes = SchemaAttributes,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  schema: Schema<SA>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetDefaultValuesResult = [Record<string, any>, Record<string, any>];

export interface IDefaultValueProvider<
  SA extends SchemaAttributes = SchemaAttributes,
> {
  getDefaultValues<T extends GetDefaultValuesParams<SA>>(
    params: T,
  ): GetDefaultValuesResult;
}

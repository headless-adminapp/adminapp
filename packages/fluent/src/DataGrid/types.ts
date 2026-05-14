import type {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import type { Data } from '@headless-adminapp/core/transport';

export type UniqueRecord = Data<InferredSchemaType<SchemaAttributes>> & {
  __uuid: string;
};

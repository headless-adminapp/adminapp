import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data } from '@headless-adminapp/core/transport';

export type UniqueRecord = Data<InferredSchemaType<SchemaAttributes>> & {
  __uuid: string;
};

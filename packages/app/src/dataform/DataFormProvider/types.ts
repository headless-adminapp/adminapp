import { Form } from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { Data, IDataService } from '@headless-adminapp/core/transport';

export type RetriveRecordFnOptions<SA extends SchemaAttributes> = {
  recordId: string;
  dataService: IDataService;
  form: Form<SA>;
  schema: Schema<SA>;
  columns: (keyof SA)[];
  schemaStore: ISchemaStore;
};

export type RetriveRecordFn<SA extends SchemaAttributes> = (
  options: RetriveRecordFnOptions<SA>
) => Promise<Data<InferredSchemaType<SA>>>;

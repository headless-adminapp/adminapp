import type { Id } from '@headless-adminapp/core/attributes';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import {
  AggregateAttribute,
  CreateRecordResult,
  Data,
  IDataService,
  InferredAggregateQueryResult,
} from '@headless-adminapp/core/transport';
import {
  RetriveRecordsFnOptions,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport/operations';

interface Options {
  data: Record<string, unknown[]>;
  schemas: Record<string, Schema>;
  idGenerator: (logicalName: string, records: unknown[]) => string | number;
}

export class InMemoryDataService implements IDataService {
  // , IActionService, IReportService
  public constructor(private readonly options: Options) {}

  private getSchema(logicalName: string) {
    const schema = this.options.schemas[logicalName];

    if (!schema) {
      throw new Error(`Schema for ${logicalName} not found`);
    }

    return schema;
  }

  private getCollection<T>(logicalName: string) {
    if (!this.options.data[logicalName]) {
      throw new Error(`Entity ${logicalName} not found`);
    }

    return this.options.data[logicalName] as T[];
  }

  public async retriveRecord<T = unknown>(
    logicalName: string,
    id: Id
  ): Promise<Data<T>> {
    const schema = this.getSchema(logicalName);
    const records =
      this.getCollection<InferredSchemaType<SchemaAttributes>>(logicalName);

    const record = records.find((record) => {
      return record[schema.idAttribute] === id;
    });

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    return record as any;
  }

  public async retriveRecords<T = unknown>({
    logicalName,
  }: RetriveRecordsFnOptions<T>): Promise<RetriveRecordsResult<T>> {
    const records =
      this.getCollection<InferredSchemaType<SchemaAttributes>>(logicalName);

    return {
      logicalName,
      records: records as Data<T>[],
      count: records.length,
    } as any;
  }

  public async createRecord<T>(
    logicalName: string,
    data: Partial<T>
  ): Promise<CreateRecordResult> {
    const schema = this.getSchema(logicalName);
    const records =
      this.getCollection<InferredSchemaType<SchemaAttributes>>(logicalName);

    const newId = this.options.idGenerator(logicalName, records);

    const newRecord = {
      ...data,
      [schema.idAttribute]: newId,
    };

    records.push(newRecord);

    return { id: newId } as any;
  }

  public async updateRecord<T>(
    logicalName: string,
    id: string,
    data: Partial<T>
  ) {
    const schema = this.getSchema(logicalName);
    const records =
      this.getCollection<InferredSchemaType<SchemaAttributes>>(logicalName);

    const record = records.find((record) => {
      return record[schema.idAttribute] === id;
    });

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, data);

    return { id } as any;
  }

  public async deleteRecord(logicalName: string, id: string) {
    const schema = this.getSchema(logicalName);
    const records =
      this.getCollection<InferredSchemaType<SchemaAttributes>>(logicalName);

    const index = records.findIndex((record) => {
      return record[schema.idAttribute] === id;
    });

    if (index === -1) {
      throw new Error(`Record with id ${id} not found`);
    }

    records.splice(index, 1);
  }

  public async executeAction<T>() {
    return {} as T;
  }

  public async getReportData<T>() {
    return {} as T;
  }

  public async retriveAggregate<
    Q extends Record<string, AggregateAttribute> = Record<
      string,
      AggregateAttribute
    >
  >(): Promise<InferredAggregateQueryResult<Q>[]> {
    return [] as any;
  }

  public async customAction<T = unknown>(): Promise<T> {
    return {} as T;
  }
}

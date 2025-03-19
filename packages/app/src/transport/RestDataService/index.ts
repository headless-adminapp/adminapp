import {
  AggregateAttribute,
  AggregateQuery,
  CreateRecordResult,
  Data,
  HttpError,
  IDataService,
  InferredAggregateQueryResult,
} from '@headless-adminapp/core/transport';
import {
  RetriveRecordsFnOptions,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport/operations';

interface RestDataServiceOptions {
  endpoint: string;
}

export async function handleResponseError(response: Response) {
  if (response.ok) {
    return;
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    const data = await response.json();

    if (data.error) {
      throw new HttpError(response.status, data.error);
    }
  }

  throw new HttpError(response.status, response.statusText);
}

export class RestDataService implements IDataService {
  public constructor(protected readonly options: RestDataServiceOptions) {}
  protected readonly headers: Record<string, string> = {};

  private getHeaders() {
    return {
      'content-type': 'application/json',
      ...this.headers,
    };
  }

  public setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  public removeHeader(name: string) {
    delete this.headers[name];
  }

  protected async execute<T = unknown, D = unknown>(data: D): Promise<T> {
    const response: Response = await fetch(this.options.endpoint, {
      headers: this.getHeaders(),
      method: 'POST',
      body: JSON.stringify(data),
    });

    await handleResponseError(response);

    return response.json();
  }

  public async retriveRecord<T = unknown>(
    logicalName: string,
    id: string,
    columns: (keyof T)[],
    expand?: {
      [key in keyof T]?: string[];
    }
  ) {
    return this.execute<Data<T>>({
      type: 'retriveRecord',
      payload: {
        logicalName,
        id,
        columns,
        expand,
      },
    });
  }

  public async retriveRecords<T = unknown>(
    params: RetriveRecordsFnOptions<T>
  ): Promise<RetriveRecordsResult<T>> {
    return this.execute<RetriveRecordsResult<T>>({
      type: 'retriveRecords',
      payload: params,
    });
  }

  public async createRecord<T>(logicalName: string, data: Partial<T>) {
    return this.execute<CreateRecordResult>({
      type: 'createRecord',
      payload: {
        logicalName,
        data,
      },
    });
  }

  public async updateRecord<T>(
    logicalName: string,
    id: string,
    data: Partial<T>
  ) {
    return this.execute<CreateRecordResult>({
      type: 'updateRecord',
      payload: {
        logicalName,
        id,
        data,
      },
    });
  }

  public async deleteRecord(logicalName: string, id: string) {
    return this.execute<void>({
      type: 'deleteRecord',
      payload: {
        logicalName,
        id,
      },
    });
  }

  public async retriveAggregate<
    Q extends Record<string, AggregateAttribute> = Record<
      string,
      AggregateAttribute
    >
  >(query: AggregateQuery<Q>): Promise<InferredAggregateQueryResult<Q>[]> {
    const result = await this.execute<InferredAggregateQueryResult<Q>[]>({
      type: 'retriveAggregate',
      payload: query,
    });

    return result;
  }

  public async customAction<T = unknown>(
    actionName: string,
    payload: unknown
  ): Promise<T> {
    const result = await this.execute<T>({
      type: 'customAction',
      payload: {
        actionName,
        payload,
      },
    });

    return result;
  }
}

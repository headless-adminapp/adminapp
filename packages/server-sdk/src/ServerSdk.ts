import {
  LookupAttribute,
  LookupBehavior,
} from '@headless-adminapp/core/attributes';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import {
  AggregateQuery,
  BadRequestError,
  CreateRecordParams,
  CreateRecordResult,
  DeleteRecordParams,
  DeleteRecordResult,
  ForbiddenError,
  RetriveRecordParams,
  RetriveRecordResult,
  RetriveRecordsParams,
  RetriveRecordsResult,
  UpdateRecordParams,
  UpdateRecordResult,
} from '@headless-adminapp/core/transport';

import { ChangedValues } from './types/ChangedValues';
import { DatabaseContext } from './types/DatabaseContext';
import { IAutoNumberProvider } from './types/IAutoNumberProvider';
import { IDataFilter } from './types/IDataFilter';
import { IDefaultValueProvider } from './types/IDefaultValueProvider';
import { IPluginStore } from './types/plugin/IPluginStore';
import { ExecuteParams, ExecuteType, IServerSdk } from './types/sdk';
import { ServerSdkContext } from './types/sdk/ServerSdkContext';

export interface ServerSdkOptions<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext,
  SA extends SchemaAttributes = SchemaAttributes
> {
  context: SdkContext;
  schemaStore: ISchemaStore<SA>;
  pluginStore?: IPluginStore<SdkContext, DbContext>;
  defaultValueProvider?: IDefaultValueProvider<SA>;
  autoNumberProvider?: IAutoNumberProvider;
  dataFilter?: IDataFilter<SdkContext, DbContext>;
}

export abstract class ServerSdk<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext,
  SA extends SchemaAttributes = SchemaAttributes,
  Options extends ServerSdkOptions<
    SdkContext,
    DbContext,
    SA
  > = ServerSdkOptions<SdkContext, DbContext, SA>
> implements IServerSdk
{
  protected timezone: string;
  protected readonly options: Options;
  constructor(options: Omit<Options, 'context'> & { context?: SdkContext }) {
    this.timezone = options.context?.timezone ?? 'UTC';
    this.options = {
      ...options,
      context: {
        ...options.context,
        timezone: this.timezone,
      },
    } as Options;
  }

  protected async validateCreate(schema: Schema<SA>) {
    if (schema.restrictions?.disableCreate) {
      throw new ForbiddenError('Creating is disabled for this entity');
    }

    if (schema.virtual) {
      throw new ForbiddenError('Creating is not allowed for virtual entities');
    }
  }

  protected async validateUpdate(schema: Schema<SA>) {
    if (schema.restrictions?.disableUpdate) {
      throw new ForbiddenError('Updating is disabled for this entity');
    }

    if (schema.virtual) {
      throw new ForbiddenError('Updating is not allowed for virtual entities');
    }
  }

  protected async validateDelete(schema: Schema<SA>) {
    if (schema.restrictions?.disableDelete) {
      throw new ForbiddenError('Deleting is disabled for this entity');
    }

    if (schema.virtual) {
      throw new ForbiddenError('Deleting is not allowed for virtual entities');
    }
  }

  protected async validateIndex(schema: Schema<SA>) {
    if (schema.restrictions?.disableIndex) {
      throw new ForbiddenError('Retriving is disabled for this entity');
    }
  }

  protected async validate(params: ExecuteParams): Promise<void> {
    if (!this.options.schemaStore.hasSchema(params.payload.logicalName)) {
      throw new BadRequestError(
        `Schema for ${params.payload.logicalName} not found`
      );
    }

    const schema = this.options.schemaStore.getSchema(
      params.payload.logicalName
    );

    switch (params.type) {
      case ExecuteType.createRecord:
        await this.validateCreate(schema);
        break;
      case ExecuteType.updateRecord:
        await this.validateUpdate(schema);
        break;
      case ExecuteType.deleteRecord:
        await this.validateDelete(schema);
        break;
      case ExecuteType.retriveRecords:
        await this.validateIndex(schema);
        break;
      case ExecuteType.retriveRecord:
        break;
      case ExecuteType.retriveAggregate:
        break;
      default:
        throw new BadRequestError('Invalid execute type');
    }
  }

  public async executeInternal(params: ExecuteParams): Promise<unknown> {
    await this.validate(params);

    switch (params.type) {
      case ExecuteType.retriveRecord:
        return this.retriveRecord(params.payload);
      case ExecuteType.retriveRecords:
        return this.retriveRecords(params.payload);
      case ExecuteType.deleteRecord:
        return this.deleteRecord(params.payload);
      case ExecuteType.createRecord:
        return this.createRecord(params.payload);
      case ExecuteType.updateRecord:
        return this.updateRecord(params.payload);
      case ExecuteType.retriveAggregate:
        return this.retriveAggregate(params.payload);
      default:
        throw new BadRequestError('Invalid execute type');
    }
  }

  public async execute(params: ExecuteParams) {
    const isReadRequest = [
      ExecuteType.retriveRecord,
      ExecuteType.retriveRecords,
      ExecuteType.retriveAggregate,
    ].includes(params.type);

    if (!params || !params.type || !params.payload) {
      throw new BadRequestError('Invalid request');
    }

    if (isReadRequest) {
      return this.executeInternal(params);
    }

    try {
      await this.startSesssion();

      const result = await this.executeInternal(params);
      await this.commitSession();
      return result;
    } catch (error) {
      await this.abortSession();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  abstract startSesssion(): Promise<void>;
  abstract commitSession(): Promise<void>;
  abstract abortSession(): Promise<void>;
  abstract endSession(): Promise<void>;

  protected abstract retriveRecord<T extends Record<string, unknown>>(
    params: RetriveRecordParams
  ): Promise<RetriveRecordResult<T>>;

  protected abstract retriveRecords<T extends Record<string, unknown>>(
    params: RetriveRecordsParams
  ): Promise<RetriveRecordsResult<T>>;

  protected abstract deleteRecord(
    params: DeleteRecordParams
  ): Promise<DeleteRecordResult>;
  protected abstract createRecord(
    params: CreateRecordParams
  ): Promise<CreateRecordResult>;
  protected abstract updateRecord(
    params: UpdateRecordParams
  ): Promise<UpdateRecordResult>;
  protected abstract retriveAggregate<T = unknown>(
    params: AggregateQuery
  ): Promise<T[]>;

  protected getChangedValues<T extends Record<string, any>>(
    previousData: T,
    newData: T
  ): ChangedValues {
    const changes: ChangedValues = {};

    for (const [key, value] of Object.entries(newData)) {
      if (previousData[key] !== value) {
        changes[key] = {
          previousValue: previousData[key],
          newValue: value,
        };
      }
    }

    return changes;
  }

  protected getSchemaDefaultValues<T extends SchemaAttributes>(
    schema: Schema<T>
  ): Record<string, unknown> {
    return Object.entries(schema.attributes).reduce((acc, [key, attribute]) => {
      if (
        key === schema.idAttribute ||
        key === schema.createdAtAttribute ||
        key === schema.updatedAtAttribute
      ) {
        return acc;
      }

      if (!('default' in attribute)) {
        return acc;
      }

      if (typeof attribute.default === 'function') {
        acc[key] = attribute.default();
      }

      if (attribute.type === 'date' && attribute.default === '@now') {
        acc[key] = new Date().toISOString();
      }

      acc[key] = attribute.default;

      return acc;
    }, {} as Record<string, unknown>);
  }

  protected getDependedAttributes(schema: Schema<SA>) {
    const allSchemas = Object.values(this.options.schemaStore.getAllSchema());

    const dependedAttributes: Array<{
      attributeName: string;
      schemaLogicalName: string;
      behavior?: LookupBehavior;
    }> = allSchemas
      .map((x) => {
        const allAttributes = Object.entries(x.attributes);

        const lookupAttributes = allAttributes.filter(
          ([, attribute]) =>
            attribute.type === 'lookup' &&
            attribute.entity === schema.logicalName
        ) as [string, LookupAttribute][];

        return lookupAttributes.map(([key, attribute]) => ({
          attributeName: key,
          schemaLogicalName: x.logicalName,
          behavior: attribute.behavior as LookupBehavior,
        }));
      })
      .flat();

    return dependedAttributes;
  }
}

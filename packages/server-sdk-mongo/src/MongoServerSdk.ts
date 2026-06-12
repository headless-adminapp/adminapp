import type { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import {
  type AggregateAttributeValue,
  type AggregateQuery,
  type CreateRecordParams,
  type CreateRecordResult,
  type Data,
  type DeleteRecordParams,
  type DeleteRecordResult,
  type Filter,
  ForbiddenError,
  NotFoundError,
  type RetriveRecordParams,
  type RetriveRecordResult,
  type RetriveRecordsParams,
  type RetriveRecordsResult,
  type UpdateRecordParams,
  type UpdateRecordResult,
} from '@headless-adminapp/core/transport';
import {
  type DependentRecord,
  ExecutionStage,
  type IAutoNumberProvider,
  MessageName,
  type ResovleAutoNumberParams,
  ServerSdk,
  type ServerSdkContext,
  type ServerSdkOptions,
} from '@headless-adminapp/server-sdk';
import mongoose, {
  type ClientSession,
  type FilterQuery,
  type PipelineStage,
  startSession,
  Types,
} from 'mongoose';

import { transformFilter } from './conditions';
import { getDependentRecordsToDelete } from './getDependentRecordsToDelete';
import { LookupPipelineBuilder } from './LookupPipelineBuilder';
import type { MongoSchemaStore } from './MongoSchemaStore';
import { ProjectionPipelineStageBuilder } from './ProjectionBuilder';
import type { MongoRequiredSchemaAttributes } from './types';
import { transformRecord } from './utils/transform';

export interface MongoDatabaseContext {
  session: ClientSession;
}

interface MongoServerSdkOptions<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends MongoDatabaseContext = MongoDatabaseContext,
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
> extends ServerSdkOptions<SdkContext, DbContext, SA> {
  schemaStore: MongoSchemaStore<SA>;
}

export class MongoServerSdk<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends MongoDatabaseContext = MongoDatabaseContext,
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
  Options extends MongoServerSdkOptions<SdkContext, DbContext, SA> =
    MongoServerSdkOptions<SdkContext, DbContext, SA>,
> extends ServerSdk<SdkContext, DbContext, SA, Options> {
  protected session: ClientSession | null = null;

  // constructor(options: Options) {
  //   super(options);
  // }

  public async startSesssion() {
    if (!this.supportSession()) {
      return;
    }
    this.session = await startSession();
    this.session.startTransaction();
  }
  public async commitSession() {
    if (this.session) {
      await this.session.commitTransaction();
    }
  }
  public async abortSession() {
    if (this.session) {
      await this.session.abortTransaction();
    }
  }

  public async endSession(): Promise<void> {
    if (this.session) {
      await this.session.endSession();
      this.session = null;
    }
  }

  private supportSession(): boolean {
    const client = mongoose.connection.getClient();

    if (!('topology' in client)) {
      return false;
    }

    const topology = client.topology as {
      s: {
        description: {
          type: string;
        };
      };
    };

    const isReplicaSet =
      topology.s.description.type === 'ReplicaSetWithPrimary';
    const isSharded = topology.s.description.type === 'Sharded';

    return isReplicaSet || isSharded;
  }

  protected async retriveRecord<T extends Record<string, unknown>>(
    params: RetriveRecordParams,
  ): Promise<RetriveRecordResult<T>> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    const basePipelines: PipelineStage[] = [];

    const idAttribute = schema.attributes[schema.idAttribute];

    let recordId: unknown = params.id;

    if ('objectId' in idAttribute) {
      recordId = new Types.ObjectId(params.id);
    }

    basePipelines.push({
      $match: {
        _id: recordId,
      },
    });

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (orgFilter) {
      basePipelines.push({
        $match: orgFilter,
      });
    }

    const permissionFilter = transformFilter(
      this.options.dataFilter?.getPermissionFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (permissionFilter) {
      basePipelines.push({
        $match: permissionFilter,
      });
    }

    const lookupPipelines = new LookupPipelineBuilder({
      schema,
      schemaStore: this.options.schemaStore,
      columns: params.columns,
      expand: params.expand,
    }).build();

    basePipelines.push(...lookupPipelines);

    const projection = new ProjectionPipelineStageBuilder({
      columns: params.columns,
      expand: params.expand,
      schema,
      schemaStore: this.options.schemaStore,
    }).build();

    if (Object.keys(projection.$project).length) {
      basePipelines.push(projection);
    }

    const records = await model
      .aggregate(basePipelines, {
        collation: { locale: 'en' },
        session: this.session,
      })
      .exec();

    const lookupFields = Object.entries(schema.attributes)
      .filter(([, attribute]) => attribute.type === 'lookup')
      .map(([key]) => key);

    records.forEach((record) => {
      lookupFields.forEach((key) => {
        if (record[key] && !record[key]._id) {
          record[key] = null;
        }
      });
    });

    if (!records.length) {
      throw new NotFoundError('Record not found');
    }

    const transformedRecords = this.transformRecords(records, {
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    return transformedRecords[0] as RetriveRecordResult<T>;
  }

  protected async retriveRecords<T extends Record<string, unknown>>(
    params: RetriveRecordsParams,
  ): Promise<RetriveRecordsResult<T>> {
    const logicalName = params.logicalName;

    const model = this.options.schemaStore.getModel(logicalName);
    const schema = this.options.schemaStore.getSchema(logicalName);

    const basePipelines: PipelineStage[] = [];

    const orgFilter = this.options.dataFilter?.getOrganizationFilter({
      logicalName,
      dbContext: {
        session: this.session,
      } as DbContext,
      sdkContext: this.options.context,
    });

    const transformedOrgFilter = transformFilter(orgFilter, schema, {
      timezone: this.timezone,
      schemaStore: this.options.schemaStore,
    });

    if (transformedOrgFilter) {
      basePipelines.push({
        $match: transformedOrgFilter,
      });
    }

    const permissionFilter = this.options.dataFilter?.getPermissionFilter({
      logicalName,
      dbContext: {
        session: this.session,
      } as DbContext,
      sdkContext: this.options.context,
    });

    const transformedPermissionFilter = transformFilter(
      permissionFilter,
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (transformedPermissionFilter) {
      basePipelines.push({
        $match: transformedPermissionFilter,
      });
    }

    const extendedKeys = extractExtendedKeyFromFilters(
      permissionFilter,
      orgFilter,
      params.filter,
    );

    const lookupPipelineBuilder = new LookupPipelineBuilder({
      includeSearchable: !!params.search,
      schema,
      schemaStore: this.options.schemaStore,
      columns: params.columns,
      expand: params.expand,
      expandedKeys: extendedKeys,
    });

    const lookupPipelines = lookupPipelineBuilder.build();

    basePipelines.push(...lookupPipelines);

    if (params?.filter) {
      const transformedFilter = transformFilter(params.filter, schema, {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      });
      if (transformedFilter) {
        basePipelines.push({
          $match: transformedFilter,
        });
      }
    }

    if (params?.search) {
      const search = params.search;
      const searchFields = Array.from(
        new Set([
          schema.primaryAttribute,
          ...Object.keys(schema.attributes).filter(
            (x) => schema.attributes[x].searchable,
          ),
        ]),
      );

      const searchFilter = searchFields
        .map((x) => {
          const attribute = schema.attributes[x];
          if (attribute.type === 'string') {
            return {
              [x]: {
                $regex: search,
                $options: 'i',
              },
            };
          } else if (attribute.type === 'number') {
            if (isNaN(parseInt(search))) {
              return null;
            }

            return {
              [x]: {
                $eq: Number(search),
              },
            };
          } else if (attribute.type === 'lookup') {
            const lookupSchema = this.options.schemaStore.getSchema(
              attribute.entity,
            );

            return {
              [`@expand.${x as string}.${
                lookupSchema.primaryAttribute as string
              }`]: {
                $regex: search,
                $options: 'i',
              },
            };
          }

          return null;
        })
        .filter(Boolean) as FilterQuery<unknown>[];

      if (searchFilter.length) {
        basePipelines.push({
          $match: {
            $or: searchFilter,
          },
        });
      } else {
        return { logicalName, records: [], count: 0 };
      }
    }

    const listPipeline = [...basePipelines];
    const countPipeline = [...basePipelines];

    const sort = params?.sort?.reduce(
      (acc, x) => {
        acc[x.field] = x.order === 'asc' ? 1 : -1;
        return acc;
      },
      {} as Record<string, 1 | -1>,
    );

    if (sort && Object.keys(sort).length) {
      listPipeline.push({ $sort: sort });
    }

    if (params?.skip) {
      listPipeline.push({ $skip: params.skip ?? 0 });
    }

    listPipeline.push({ $limit: params?.limit ?? 100 });

    const projection = new ProjectionPipelineStageBuilder({
      schema,
      columns: params.columns,
      expand: params.expand,
      schemaStore: this.options.schemaStore,
    }).build();

    if (Object.keys(projection.$project).length) {
      listPipeline.push(projection);
    }

    const records = await model
      .aggregate(listPipeline, {
        collation: { locale: 'en' },
        session: this.session,
      })
      .exec();

    const lookupFields = Object.entries(schema.attributes)
      .filter(([, attribute]) => attribute.type === 'lookup')
      .map(([key]) => key);

    records.forEach((record) => {
      lookupFields.forEach((key) => {
        if (record[key] && !record[key]._id) {
          record[key] = null;
        }
      });
    });

    const count = await model
      .aggregate(countPipeline, { session: this.session })
      .count('count')
      .exec();

    const transformedRecords = this.transformRecords(records, {
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    return {
      logicalName,
      records: transformedRecords as Data<T>[],
      count: count.length ? count[0].count : 0,
    };
  }

  protected async deleteRecord(
    params: DeleteRecordParams,
  ): Promise<DeleteRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    model.db.getClient();

    if (this.supportSession() && !this.session) {
      throw new Error('Session is not started');
    }

    const idAttribute = schema.attributes[schema.idAttribute];

    let recordId: unknown = params.id;

    if ('objectId' in idAttribute) {
      recordId = new Types.ObjectId(params.id);
    }

    const filter: FilterQuery<unknown> = {
      $and: [{ _id: recordId }],
    };

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (orgFilter) {
      filter.$and!.push(orgFilter);
    }

    const permissionFilter = transformFilter(
      this.options.dataFilter?.getPermissionFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (permissionFilter) {
      filter.$and!.push(permissionFilter);
    }

    const record = await model.findOne(filter, undefined, {
      session: this.session,
    });

    if (!record) {
      throw new NotFoundError('Record not found');
    }

    const dependedRecordToBeDeleted: DependentRecord[] =
      await getDependentRecordsToDelete({
        schema,
        _id: record._id,
        session: this.session,
        schemaStore: this.options.schemaStore,
      });

    if (dependedRecordToBeDeleted.length) {
      for (const { logicalName, id, record } of dependedRecordToBeDeleted) {
        const model = this.options.schemaStore.getModel(logicalName);

        await this.options.pluginStore?.execute({
          logicalName,
          messageName: MessageName.Delete,
          stage: ExecutionStage.PreOperation,
          data: record.toJSON(),
          changedValues: {},
          snapshot: record.toJSON(),
          sdkContext: this.options.context,
          dbContext: {
            session: this.session,
          },
        });

        await model.findByIdAndDelete(id, {
          session: this.session,
        });

        await this.options.pluginStore?.execute({
          logicalName,
          messageName: MessageName.Delete,
          stage: ExecutionStage.PostOperation,
          data: record.toJSON(),
          changedValues: {},
          snapshot: null,
          sdkContext: this.options.context,
          dbContext: {
            session: this.session,
          },
        });
      }
    }

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      messageName: MessageName.Delete,
      stage: ExecutionStage.PreOperation,
      data: record.toJSON(),
      changedValues: {},
      snapshot: record.toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    await model.findByIdAndDelete(params.id, {
      session: this.session,
    });

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      messageName: MessageName.Delete,
      stage: ExecutionStage.PostOperation,
      data: record.toJSON(),
      changedValues: {},
      snapshot: null,
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    return {
      logicalName: params.logicalName,
      id: params.id,
    };
  }

  private transformToDbRecord(data: unknown, schema: Schema<SA>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbRecord = Object.entries(data as Record<string, any>).reduce(
      (acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }

        const attribute = schema.attributes[key];

        if (!attribute) {
          return acc;
        }

        if (key === '_id' && !value) {
          return acc;
        }

        if (value === null) {
          acc[key] = null;
          return acc;
        }

        if (attribute.type === 'id') {
          if ('objectId' in attribute) {
            value = new Types.ObjectId(value as string);
          }

          acc[key] = value;
        } else if (schema.attributes[key]?.type === 'lookup') {
          if (typeof value === 'object') {
            value = value.id;
          }

          if ('objectId' in schema.attributes[key]) {
            acc[key] = new Types.ObjectId(value as string);
          } else {
            acc[key] = value;
          }
        } else if (attribute.type === 'regarding') {
          acc[key] = value.id;
          acc[attribute.entityTypeAttribute] = value.logicalName;
        } else if (schema.attributes[key]?.type === 'attachment') {
          if (typeof value === 'object') {
            acc[key] = value.url;
          } else if (typeof value === 'string') {
            acc[key] = value;
          }
        } else if (schema.attributes[key]?.type === 'choice') {
          if (typeof value === 'object' && 'value' in value) {
            acc[key] = value.value;
          } else {
            acc[key] = value;
          }
        } else if (
          attribute.type === 'string' &&
          attribute.format === 'password' &&
          attribute.redact
        ) {
          if (value !== '********') {
            // if value is same as redacted value, it means password is not changed, so we should not update it in db
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }

        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>,
    );
    return dbRecord;
  }

  protected async createRecord(
    params: CreateRecordParams,
  ): Promise<CreateRecordResult> {
    if (this.supportSession() && !this.session) {
      throw new Error('Session is not started');
    }

    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    let data = params.data;

    data = this.transformToDbRecord(data, schema);

    const defaultValues = this.options.defaultValueProvider?.getDefaultValues({
      data,
      schema,
    });

    data = { ...defaultValues, ...data };

    const autoNumberAttributes = Object.entries(schema.attributes).filter(
      ([, attribute]) => {
        return attribute.type === 'number' && attribute.autoNumber;
      },
    );

    if (autoNumberAttributes.length) {
      for (const [key] of autoNumberAttributes) {
        if (data[key] !== undefined) {
          continue;
        }

        if (this.options.autoNumberProvider) {
          data[key] = this.options.autoNumberProvider.resolveAutoNumber({
            logicalName: params.logicalName,
            attributeName: key,
            dbContext: {
              session: this.session,
            },
            sdkContext: this.options.context,
            markAsUsed: true,
          });
        }
      }
    }

    let changedValues = this.getChangedValues({}, data);

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      messageName: MessageName.Create,
      stage: ExecutionStage.PreOperation,
      data,
      changedValues,
      snapshot: null,
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    const record = await model.create([data], { session: this.session });

    changedValues = this.getChangedValues({}, data);

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      id: record[0]._id!.toString(),
      messageName: MessageName.Create,
      stage: ExecutionStage.PostOperation,
      data: record[0].toJSON(),
      changedValues,
      snapshot: record[0].toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    return { id: record[0]._id!.toString(), logicalName: params.logicalName };
  }

  protected async updateRecord(
    params: UpdateRecordParams,
  ): Promise<UpdateRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    if (schema.restrictions?.disableUpdate) {
      throw new ForbiddenError('Updating is disabled for this entity');
    }

    const data = this.transformToDbRecord(params.data, schema);

    // Remove idAttribute from data
    delete data[schema.idAttribute as string];

    const existingRecord = await model.findOne(
      {
        _id: params.id,
      },
      undefined,
      {
        session: this.session,
      },
    );

    if (!existingRecord) {
      throw new NotFoundError('Record not found');
    }

    let changedValues = this.getChangedValues(existingRecord.toJSON(), data);

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      id: params.id,
      messageName: MessageName.Update,
      stage: ExecutionStage.PreOperation,
      data,
      changedValues,
      snapshot: existingRecord.toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    const updatedRecord = await model.findByIdAndUpdate(
      params.id,
      {
        $set: data,
      },
      { session: this.session },
    );

    changedValues = this.getChangedValues(existingRecord.toJSON(), data);

    await this.options.pluginStore?.execute({
      logicalName: schema.logicalName,
      id: params.id,
      messageName: MessageName.Update,
      stage: ExecutionStage.PostOperation,
      data: updatedRecord!.toJSON(),
      changedValues,
      snapshot: updatedRecord!.toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    return { id: params.id, logicalName: params.logicalName };
  }

  private async resolveAutoNumber() {
    // TODO
  }

  private transformRecords<SA extends SchemaAttributes>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    records: any[],
    {
      schema,
      columns,
      expand,
    }: {
      schema: Schema<SA>;
      columns?: string[];
      expand?: RetriveRecordsParams['expand'];
    },
  ) {
    return records.map((record) =>
      transformRecord({
        record,
        schema: schema as unknown as Schema,
        columns,
        expand,
        schemaStore: this.options.schemaStore as unknown as ISchemaStore,
      }),
    );
  }

  /** @todo: unfinished code */
  protected async retriveAggregate<T = unknown>(
    query: AggregateQuery,
  ): Promise<T[]> {
    const logicalName = query.logicalName;
    const schema = this.options.schemaStore.getSchema(query.logicalName);
    const model = this.options.schemaStore.getModel(query.logicalName);

    const basePipelines: PipelineStage[] = [];

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: query.logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (orgFilter) {
      basePipelines.push({
        $match: orgFilter,
      });
    }

    const permissionFilter = transformFilter(
      this.options.dataFilter?.getPermissionFilter({
        logicalName,
        dbContext: {
          session: this.session,
        } as DbContext,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      },
    );

    if (permissionFilter) {
      basePipelines.push({
        $match: permissionFilter,
      });
    }

    const lookupPipelines: PipelineStage[] = [];

    const set = new Set<string>();

    function extractExtendedKeyFromValue(
      key: string,
      value: AggregateAttributeValue,
    ) {
      if (value.type === 'column') {
        if (value.expandedKey) {
          set.add(key);
        }
      } else if (value.type === 'function') {
        value.params.forEach((param) => {
          extractExtendedKeyFromValue(key, param);
        });
      } else if (value.type === 'if-else') {
        extractExtendedKeyFromValue(key, value.value.then);
        extractExtendedKeyFromValue(key, value.value.else);

        if (value.value.condition.extendedKey) {
          set.add(value.value.condition.field);
        }
      }
    }

    Object.entries(query.attributes).forEach(([key, attribute]) => {
      const value = attribute.value;

      extractExtendedKeyFromValue(key, value);
    });

    if (query.filter) {
      extractExtendedKeyFromFilters(query.filter).forEach((x) => set.add(x));
    }

    Object.entries(schema.attributes).forEach(([key, attribute]) => {
      if (attribute.type === 'lookup') {
        // either column included
        // either searchable and search text included
        // either expand included
        if (set.has(key)) {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity,
          );
          lookupPipelines.push({
            $lookup: {
              from: lookupSchema.logicalName,
              localField: key,
              foreignField: '_id',
              as: `@expand.${key}`,
            },
          });
          lookupPipelines.push({
            $unwind: {
              path: `$@expand.${key}`,
              preserveNullAndEmptyArrays: true,
            },
          });
        }
      }
    });

    basePipelines.push(...lookupPipelines);

    if (query.filter) {
      const transformedFilter = transformFilter<SA>(query.filter, schema, {
        timezone: this.timezone,
        schemaStore: this.options.schemaStore,
      });
      if (transformedFilter) {
        basePipelines.push({
          $match: transformedFilter,
        });
      }
    }

    // const sort = query.orders?.reduce((acc, x) => {
    //   acc[x.field] = x.order === 'asc' ? 1 : -1;
    //   return acc;
    // }, {} as Record<string, 1 | -1>);

    // const { attributes, groupBy, includes, orders } =
    //   this.prepareAggreate(query);

    // const whereClause = this.prepareWhereClause({
    //   logicalName: query.logicalName,
    //   filter: query.filter,
    //   search: null,
    // });

    // const records = await model.findAll({
    //   attributes: attributes,
    //   group: groupBy,
    //   order: orders,
    //   include: includes,
    //   where: whereClause.length ? { [Op.and]: whereClause } : undefined,
    //   limit: query.limit ?? 100,
    // });

    // if (query.reverse) {
    //   records.reverse();
    // }

    const result = await model.aggregate([
      ...basePipelines,
      // {
      //   $lookup: {
      //     from: 'categories',
      //     localField: 'category',
      //     foreignField: '_id',
      //     as: 'category',
      //   },
      // },
      // { $unwind: { path: '$category' } },
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: '%Y-%m',
                date: '$transactionDate',
              },
            },
          },
          income: {
            $sum: {
              $cond: {
                if: { $in: ['$@expand.category.nature', ['DI']] },
                then: '$amount',
                else: 0,
              },
            },
          },
          expense: {
            $sum: {
              $cond: {
                if: { $in: ['$@expand.category.nature', ['DE', 'IE']] },
                then: '$amount',
                else: 0,
              },
            },
          },
        },
      },
      {
        $limit: 10,
      },
    ]);

    result.forEach((x) => {
      const _id = x._id;
      delete x._id;

      Object.keys(_id).forEach((key) => {
        x[key] = _id[key];
      });

      return x;
    });

    return result as T[];
  }
}

export interface AutoNumberProviderBaseOptions<
  SA extends SchemaAttributes = SchemaAttributes,
> {
  schemaStore: ISchemaStore<SA>;
}

export abstract class AutoNumberProviderBase<
  SA extends SchemaAttributes = SchemaAttributes,
  Options extends AutoNumberProviderBaseOptions<SA> =
    AutoNumberProviderBaseOptions<SA>,
> implements IAutoNumberProvider {
  constructor(protected options: Options) {}

  abstract resolveAutoNumber<T extends string | number = string>(
    params: ResovleAutoNumberParams,
  ): Promise<T>;
}

function extractExtendedKeyFromFilters(
  ...filters: Array<Filter | null | undefined>
): string[] {
  const set = new Set<string>();

  for (const filter of filters) {
    if (!filter) {
      continue;
    }

    filter?.conditions?.forEach((condition) => {
      if (condition.extendedKey) {
        set.add(condition.field);
      }
    });

    if (filter.filters?.length) {
      extractExtendedKeyFromFilters(...filter.filters).forEach((x) =>
        set.add(x),
      );
    }
  }

  return Array.from(set);
}

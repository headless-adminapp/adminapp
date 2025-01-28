import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import {
  AggregateAttributeValue,
  AggregateQuery,
  CreateRecordParams,
  CreateRecordResult,
  Data,
  DeleteRecordParams,
  DeleteRecordResult,
  Filter,
  ForbiddenError,
  NotFoundError,
  RetriveRecordParams,
  RetriveRecordResult,
  RetriveRecordsParams,
  RetriveRecordsResult,
  UpdateRecordParams,
  UpdateRecordResult,
} from '@headless-adminapp/core/transport';
import {
  DependentRecord,
  ExecutionStage,
  IAutoNumberProvider,
  MessageName,
  ResovleAutoNumberParams,
  ServerSdk,
  ServerSdkContext,
  ServerSdkOptions,
} from '@headless-adminapp/server-sdk';
import mongoose, {
  ClientSession,
  FilterQuery,
  PipelineStage,
  startSession,
  Types,
} from 'mongoose';

import { transformFilter } from './conditions';
import { getDependentRecordsToDelete } from './getDependentRecordsToDelete';
import { MongoSchemaStore } from './MongoSchemaStore';
import { MongoRequiredSchemaAttributes } from './types';

export interface MongoDatabaseContext {
  session: ClientSession;
}

interface MongoServerSdkOptions<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends MongoDatabaseContext = MongoDatabaseContext,
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes
> extends ServerSdkOptions<SdkContext, DbContext, SA> {
  schemaStore: MongoSchemaStore<SA>;
}

export class MongoServerSdk<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends MongoDatabaseContext = MongoDatabaseContext,
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
  Options extends MongoServerSdkOptions<
    SdkContext,
    DbContext,
    SA
  > = MongoServerSdkOptions<SdkContext, DbContext, SA>
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
    params: RetriveRecordParams
  ): Promise<RetriveRecordResult<T>> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    const basePipelines: PipelineStage[] = [];

    basePipelines.push({
      $match: {
        _id: new Types.ObjectId(params.id),
      },
    });

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
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
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
    );

    if (permissionFilter) {
      basePipelines.push({
        $match: permissionFilter,
      });
    }

    const lookupPipelines: PipelineStage[] = [];

    Object.entries(schema.attributes).forEach(([key, attribute]) => {
      if (attribute.type === 'lookup') {
        if (params?.columns?.includes(key)) {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity
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

    const projection = this.prepareProjection({
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    if (projection) {
      basePipelines.push({
        $project: projection,
      });
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

  private prepareProjection(params: {
    columns?: string[];
    expand?: Record<string, string[] | undefined>;
    schema: Schema<SA>;
  }) {
    if (params.columns?.length) {
      const projection = params.columns.reduce((acc, x) => {
        const [key, subKey] = x.split('.');
        const attribute = params.schema.attributes[key];
        if (!attribute) {
          return acc;
        }

        if (attribute.type !== 'lookup') {
          acc[key] = 1;
          return acc;
        } else {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity
          );
          let lookupProjection: Record<string, number | string> = (acc[
            key
          ] as Record<string, number | string>) || {
            _id: 1,
          };

          if (!subKey) {
            lookupProjection = {
              ...lookupProjection,
              name: `$${key}.${lookupSchema.primaryAttribute as string}`,
              [`${key}.${lookupSchema.primaryAttribute as string}`]: 1,
              logicalName: lookupSchema.logicalName,
            };
          } else {
            lookupProjection[subKey] = 1;
          }

          acc[key] = lookupProjection;
          return acc;
        }
      }, {} as Record<string, number | string | any | Record<string, number | string>>);

      projection._id = 1;
      projection['@data:entity'] = params.schema.logicalName;

      if (params.expand && Object.keys(params.expand).length) {
        const expand = Object.keys(params.expand).reduce((acc, cur) => {
          const attribute = params.schema.attributes[cur];
          if (!attribute) {
            return acc;
          }

          if (attribute.type !== 'lookup') {
            return acc;
          }

          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity
          );

          const expandProjection = {
            '@data:entity': lookupSchema.logicalName,
            [lookupSchema.idAttribute]: `$${cur}.${
              lookupSchema.idAttribute as string
            }`,
          } as Record<string, any>;

          const columns = params.expand?.[cur] ?? [];

          columns.forEach((column) => {
            expandProjection[column] = `$${cur}.${column}`;
          });

          acc[cur] = {
            $cond: {
              if: {
                $and: [{ $eq: [{ $type: '$bankAccount' }, 'object'] }],
              },
              then: expandProjection,
              else: null,
            },
          };

          return acc;
        }, {} as Record<string, any>);

        if (Object.keys(expand).length) {
          projection['@data:expand'] = expand;
        }
      }

      return null;

      // return projection;
    } else {
      return {
        _id: 1,
        [params.schema.primaryAttribute]: 1,
        statecode: 1,
        statuscode: 1,
      };
    }
  }

  protected async retriveRecords<T extends Record<string, unknown>>(
    params: RetriveRecordsParams
  ): Promise<RetriveRecordsResult<T>> {
    const logicalName = params.logicalName;

    const model = this.options.schemaStore.getModel(logicalName);
    const schema = this.options.schemaStore.getSchema(logicalName);

    const basePipelines: PipelineStage[] = [];

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
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
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
    );

    if (permissionFilter) {
      basePipelines.push({
        $match: permissionFilter,
      });
    }

    const lookupPipelines: PipelineStage[] = [];

    Object.entries(schema.attributes).forEach(([key, attribute]) => {
      if (attribute.type === 'lookup') {
        // either column included
        // either searchable and search text included
        // either expand included
        if (
          params?.columns?.includes(key) ||
          params?.expand?.[key] ||
          (!!params?.search && attribute.searchable)
        ) {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity
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

    if (params?.filter) {
      const transformedFilter = transformFilter(params.filter, schema, {
        timezone: this.timezone,
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
            (x) => schema.attributes[x].searchable
          ),
        ])
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
              attribute.entity
            );

            return {
              [`${x as string}.${lookupSchema.primaryAttribute as string}`]: {
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

    const sort = params?.sort?.reduce((acc, x) => {
      acc[x.field] = x.order === 'asc' ? 1 : -1;
      return acc;
    }, {} as Record<string, 1 | -1>);

    const listPipeline = [...basePipelines];
    const countPipeline = [...basePipelines];

    if (sort && Object.keys(sort).length) {
      listPipeline.push({ $sort: sort });
    }

    if (params?.skip) {
      listPipeline.push({ $skip: params.skip ?? 0 });
    }

    listPipeline.push({ $limit: params?.limit ?? 100 });

    const projection = this.prepareProjection({
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    if (projection) {
      listPipeline.push({
        $project: projection,
      });
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
    params: DeleteRecordParams
  ): Promise<DeleteRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    model.db.getClient();

    if (this.supportSession() && !this.session) {
      throw new Error('Session is not started');
    }

    const filter: FilterQuery<unknown> = {
      $and: [{ _id: new Types.ObjectId(params.id) }],
    };

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
    );

    if (orgFilter) {
      filter.$and!.push(orgFilter);
    }

    const permissionFilter = transformFilter(
      this.options.dataFilter?.getPermissionFilter({
        logicalName: params.logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
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

    let dependedRecordToBeDeleted: DependentRecord[] =
      await getDependentRecordsToDelete({
        schema,
        _id: record._id as Types.ObjectId,
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

  protected async createRecord(
    params: CreateRecordParams
  ): Promise<CreateRecordResult> {
    if (this.supportSession() && !this.session) {
      throw new Error('Session is not started');
    }

    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    let data = params.data;

    data = Object.entries(data).reduce((acc, [key, value]) => {
      if (key === '_id') {
        return acc;
      }

      if (value === undefined) {
        return acc;
      }

      if (value === null) {
        acc[key] = null;
        return acc;
      }

      if (schema.attributes[key]?.type === 'lookup') {
        if (typeof value === 'object') {
          value = value.id;
        }

        acc[key] = new Types.ObjectId(value as string);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {} as Record<string, any>);

    const defaultValues = this.options.defaultValueProvider?.getDefaultValues({
      data,
      schema,
    });

    data = { ...defaultValues, ...data };

    const autoNumberAttributes = Object.entries(schema.attributes).filter(
      ([, attribute]) => {
        return attribute.type === 'number' && attribute.autoNumber;
      }
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
    params: UpdateRecordParams
  ): Promise<UpdateRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    if (schema.restrictions?.disableUpdate) {
      throw new ForbiddenError('Updating is disabled for this entity');
    }

    const data = Object.entries(params.data).reduce((acc, [key, value]) => {
      if (key === schema.idAttribute) {
        return acc;
      }

      const attribute = schema.attributes[key];

      if (!attribute) {
        return acc;
      }

      if (value === undefined) {
        return acc;
      }

      if (value === null) {
        acc[key] = null;
        return acc;
      }

      if (attribute.type === 'lookup') {
        value = value.id;

        acc[key] = value;
      } else {
        acc[key] = value;
      }

      return acc;
    }, {} as Record<string, any>);

    const existingRecord = await model.findOne(
      {
        _id: params.id,
      },
      undefined,
      {
        session: this.session,
      }
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
      { session: this.session }
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
    records: any[],
    {
      schema,
      columns,
      expand,
    }: {
      schema: Schema<SA>;
      columns?: string[];
      expand?: RetriveRecordsParams['expand'];
    }
  ) {
    return records.map((record) => {
      const transformedRecord = {
        $entity: schema.logicalName,
      } as Record<string, any>;

      let id = record[schema.idAttribute];

      if (typeof id === 'object') {
        id = id.toString();
      }
      transformedRecord[schema.idAttribute as string] = id;

      if (columns) {
        for (const column of columns) {
          const attribute = schema.attributes[column];

          if (!attribute) {
            continue;
          }

          if (attribute.type === 'lookup') {
            const lookupSchema = this.options.schemaStore.getSchema(
              attribute.entity
            );

            const expandedValue = record['@expand']?.[column];

            if (!record[column] || !expandedValue) {
              transformedRecord[column] = null;
            } else {
              transformedRecord[column] = {
                id: expandedValue[lookupSchema.idAttribute],
                name: expandedValue[lookupSchema.primaryAttribute],
                logicalName: attribute.entity,
              };
            }
          } else {
            transformedRecord[column] = record[column];
          }
        }
      }

      if (expand) {
        transformedRecord['$expand'] = {};

        for (const expandKey of Object.keys(expand)) {
          const expandedColumns = expand[expandKey]!;
          const expandedAttribute = schema.attributes[expandKey];

          if (!expandedAttribute || expandedAttribute.type !== 'lookup') {
            continue;
          }

          const expandedSchema = this.options.schemaStore.getSchema(
            expandedAttribute.entity
          );

          const expandedRecord = record['@expand']?.[expandKey];

          if (!expandedRecord) {
            continue;
          }

          transformedRecord['$expand'][expandKey] = {
            '@data:entity': expandedAttribute.entity,
          };

          Object.assign(
            transformedRecord['$expand'][expandKey],
            expandedColumns.reduce((acc, column) => {
              const attribute = expandedSchema.attributes[column];
              if (!attribute) {
                return acc;
              }

              if (attribute.type === 'lookup') {
                const nestedExpandedRecord =
                  expandedRecord['@expand']?.[column];

                if (!nestedExpandedRecord) {
                  acc[column] = null;
                } else {
                  acc[column] = {
                    id: nestedExpandedRecord[expandedSchema.idAttribute],
                    name: nestedExpandedRecord[expandedSchema.primaryAttribute],
                    logicalName: attribute.entity,
                  };
                }
              } else {
                acc[column] = expandedRecord[column];
              }

              return acc;
            }, {} as Record<string, any>)
          );
        }
      }

      return transformedRecord;
    });
  }

  /** @todo: unfinished code */
  protected async retriveAggregate<T = unknown>(
    query: AggregateQuery
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
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
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
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        timezone: this.timezone,
      }
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
      value: AggregateAttributeValue
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

    function extractExtendedKeyFromFilter(filter: Filter) {
      filter?.conditions?.forEach((condition) => {
        if (condition.extendedKey) {
          set.add(condition.field);
        }
      });

      filter.filters?.forEach((filter) => {
        extractExtendedKeyFromFilter(filter);
      });
    }

    if (query.filter) {
      extractExtendedKeyFromFilter(query.filter);
    }

    Object.entries(schema.attributes).forEach(([key, attribute]) => {
      if (attribute.type === 'lookup') {
        // either column included
        // either searchable and search text included
        // either expand included
        if (set.has(key)) {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity
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
      const transformedFilter = transformFilter(query.filter, schema, {
        timezone: this.timezone,
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
  SA extends SchemaAttributes = SchemaAttributes
> {
  schemaStore: ISchemaStore<SA>;
}

export abstract class AutoNumberProviderBase<
  SA extends SchemaAttributes = SchemaAttributes,
  Options extends AutoNumberProviderBaseOptions<SA> = AutoNumberProviderBaseOptions<SA>
> implements IAutoNumberProvider
{
  constructor(protected options: Options) {}

  abstract resolveAutoNumber<T extends string | number = string>(
    params: ResovleAutoNumberParams
  ): Promise<T>;
}

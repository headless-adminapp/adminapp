import { LookupAttribute } from '@headless-adminapp/core/attributes';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import {
  AggregateAttributeValue,
  AggregateQuery,
  AggregateType,
  ConflictError,
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
  MessageName,
  ServerSdk,
  ServerSdkContext,
  ServerSdkOptions,
} from '@headless-adminapp/server-sdk';
import {
  GroupOption,
  Model,
  Op,
  Order,
  OrderItem,
  ProjectionAlias,
  Sequelize,
  Transaction,
} from 'sequelize';
import type { Col, Fn, Literal } from 'sequelize/types/utils';

import { getLikeOperator, transformFilter } from './conditions';
import { SequelizeSchemaStore } from './SequelizeSchemaStore';
import { Id } from './types';
import { transformRecord } from './utils/transform';

export interface SequelizeDatabaseContext {
  session?: Transaction | null;
}

interface SequelizeServerSdkOptions<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends SequelizeDatabaseContext = SequelizeDatabaseContext,
  SA extends SchemaAttributes = SchemaAttributes,
> extends ServerSdkOptions<SdkContext, DbContext, SA> {
  schemaStore: SequelizeSchemaStore<SA>;
  sequelize: Sequelize;
}

export class SequelizeServerSdk<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends SequelizeDatabaseContext = SequelizeDatabaseContext,
  SA extends SchemaAttributes = SchemaAttributes,
  Options extends SequelizeServerSdkOptions<SdkContext, DbContext, SA> =
    SequelizeServerSdkOptions<SdkContext, DbContext, SA>,
> extends ServerSdk<SdkContext, DbContext, SA, Options> {
  protected session: Transaction | null = null;

  public async startSesssion() {
    this.session = await this.options.sequelize.transaction();
  }
  public async commitSession() {
    if (this.session) {
      await this.session.commit();
    }
  }
  public async abortSession() {
    if (this.session) {
      await this.session.rollback();
    }
  }

  public async endSession(): Promise<void> {
    if (this.session) {
      this.session = null;
    }
  }

  private prepareWhereClause({
    logicalName,
    filter,
    search,
  }: {
    logicalName: string;
    filter?: Filter | null;
    search: string | null | undefined;
  }): any[] {
    const schema = this.options.schemaStore.getSchema(logicalName);
    const whereClause: any[] = [];

    const orgFilter = transformFilter(
      this.options.dataFilter?.getOrganizationFilter({
        logicalName: schema.logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        schemaStore: this.options.schemaStore,
        timezone: this.timezone,
        sequelize: this.options.sequelize,
      },
    );

    if (orgFilter) {
      whereClause.push(orgFilter);
    }

    const permissionFilter = transformFilter(
      this.options.dataFilter?.getPermissionFilter({
        logicalName: schema.logicalName,
        dbContext: {
          session: this.session,
        } as any,
        sdkContext: this.options.context,
      }),
      schema,
      {
        schemaStore: this.options.schemaStore,
        timezone: this.timezone,
        sequelize: this.options.sequelize,
      },
    );

    if (permissionFilter) {
      whereClause.push(permissionFilter);
    }

    if (filter) {
      const transformedFilter = transformFilter(filter, schema, {
        schemaStore: this.options.schemaStore,
        timezone: this.timezone,
        sequelize: this.options.sequelize,
      });
      if (transformedFilter) {
        whereClause.push(transformedFilter);
      }
    }

    if (search) {
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
                [getLikeOperator(this.options.sequelize)]: `%${search}%`,
              },
            };
          } else if (attribute.type === 'number') {
            if (isNaN(parseInt(search))) {
              return null;
            }

            return {
              [x]: {
                [Op.eq]: Number(search),
              },
            };
          } else if (attribute.type === 'lookup') {
            const lookupSchema = this.options.schemaStore.getSchema(
              attribute.entity,
            );

            return {
              [`$${this.options.schemaStore.getRelationAlias(
                schema.collectionName ?? schema.logicalName,
                x as string,
                lookupSchema.collectionName ?? lookupSchema.logicalName,
              )}.${lookupSchema.primaryAttribute as string}$`]: {
                [getLikeOperator(this.options.sequelize)]: `%${search}%`,
              },
            };
          }

          return null;
        })
        .filter(Boolean);

      if (searchFilter.length) {
        whereClause.push({
          [Op.or]: searchFilter,
        });
      } else {
        throw new Error('Search is not supported');
      }
    }

    return whereClause;
  }

  private prepareIncludes({
    logicalName,
    columns,
    expand,
    search,
    sort,
  }: {
    logicalName: string;
    columns: string[] | null | undefined;
    expand?: RetriveRecordsParams['expand'];
    search?: string | null;
    sort?: RetriveRecordsParams['sort'];
  }): any[] {
    const schema = this.options.schemaStore.getSchema(logicalName);
    const includes: any[] = [];

    Object.entries(schema.attributes).forEach(([key, attribute]) => {
      if (attribute.type === 'lookup') {
        // either column included
        // either searchable and search text included
        // either expand included
        if (
          columns?.includes(key) ||
          expand?.[key] ||
          (!!search && attribute.searchable) ||
          (!!sort && sort.find((x) => x.field === key))
        ) {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity,
          );

          const nestedIncludes: any[] = [];

          if (expand?.[key]) {
            const expandedAttributes = expand[key]
              .map((x) => lookupSchema.attributes[x])
              .filter((x) => !!x && x.type === 'lookup') as LookupAttribute[];

            for (const expandedAttribute of expandedAttributes) {
              const nestedSchema = this.options.schemaStore.getSchema(
                expandedAttribute.entity,
              );

              nestedIncludes.push({
                model: this.options.schemaStore.getModel(
                  expandedAttribute.entity,
                ),
                as: this.options.schemaStore.getRelationAlias(
                  lookupSchema.collectionName ?? lookupSchema.logicalName,
                  key,
                  nestedSchema.collectionName ?? nestedSchema.logicalName,
                ),
                attributes: [
                  nestedSchema.idAttribute,
                  nestedSchema.primaryAttribute,
                ],
              });
            }
          }

          includes.push({
            model: this.options.schemaStore.getModel(attribute.entity),
            as: this.options.schemaStore.getRelationAlias(
              schema.collectionName ?? schema.logicalName,
              key,
              lookupSchema.collectionName ?? lookupSchema.logicalName,
            ),
            includes: nestedIncludes,
          });
        }
      } else if (attribute.type === 'regarding') {
        if (
          columns?.includes(key) ||
          (!!search && attribute.searchable) ||
          (!!sort && sort.find((x) => x.field === key))
        ) {
          const lookupSchemas = attribute.entities.map((entity) =>
            this.options.schemaStore.getSchema(entity),
          );

          lookupSchemas.forEach((lookupSchema) => {
            includes.push({
              model: this.options.schemaStore.getModel(
                lookupSchema.logicalName,
              ),
              as: this.options.schemaStore.getRelationAlias(
                schema.collectionName ?? schema.logicalName,
                key,
                lookupSchema.collectionName ?? lookupSchema.logicalName,
              ),
            });
          });
        }
      }
    });

    return includes;
  }

  private prepareAttributes({
    logicalName,
    columns,
  }: {
    logicalName: string;
    columns: string[] | null | undefined;
  }): string[] {
    const schema = this.options.schemaStore.getSchema(logicalName);

    const attributes: string[] = [];

    attributes.push(schema.idAttribute as string);
    attributes.push(...(columns ?? []));

    if (
      columns?.includes(schema.primaryAttribute as string) &&
      schema.avatarAttribute
    ) {
      attributes.push(schema.avatarAttribute as string);
    }

    columns?.forEach((column) => {
      const attribute = schema.attributes[column];

      if (!attribute) {
        return;
      }

      if (attribute.type === 'regarding') {
        attributes.push(attribute.entityTypeAttribute);
      }
    });

    if (schema.virtual && schema.virtual.baseSchemaLogicalNameAttribute) {
      attributes.push(schema.virtual.baseSchemaLogicalNameAttribute as string);
    }

    return Array.from(new Set(attributes));
  }

  protected async retriveRecord<T extends Record<string, unknown>>(
    params: RetriveRecordParams,
  ): Promise<RetriveRecordResult<T>> {
    const logicalName = params.logicalName;

    const model = this.options.schemaStore.getModel(logicalName);
    const schema = this.options.schemaStore.getSchema(logicalName);

    const whereClause: any[] = this.prepareWhereClause({
      filter: {
        type: 'and',
        conditions: [
          {
            field: schema.idAttribute as string,
            operator: 'eq',
            value: params.id,
          },
        ],
      },
      logicalName: params.logicalName,
      search: null,
    });
    const includes = this.prepareIncludes({
      columns: params.columns,
      logicalName: params.logicalName,
      expand: params.expand,
      search: null,
    });

    const records = await model.findAll({
      where: whereClause.length ? { [Op.and]: whereClause } : undefined,
      attributes: this.prepareAttributes({
        logicalName,
        columns: params.columns,
      }),
      include: includes,
    });

    if (!records.length) {
      throw new NotFoundError('Record not found');
    }

    const transformedRecords = this.transformRecords(records, {
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    return transformedRecords[0] as Data<T>;
  }

  protected async retriveRecords<T extends Record<string, unknown>>(
    params: RetriveRecordsParams,
  ): Promise<RetriveRecordsResult<T>> {
    const logicalName = params.logicalName;

    const model = this.options.schemaStore.getModel(logicalName);
    const schema = this.options.schemaStore.getSchema<SA>(logicalName);

    const whereClause = this.prepareWhereClause({
      logicalName: params.logicalName,
      filter: params.filter,
      search: params.search,
    });

    const includes = this.prepareIncludes({
      columns: params.columns,
      logicalName: params.logicalName,
      expand: params.expand,
      search: params.search,
    });

    const order: Order =
      params.sort?.map((x) => {
        const attribute = schema.attributes[x.field];

        if (attribute.type === 'lookup') {
          const lookupSchema = this.options.schemaStore.getSchema(
            attribute.entity,
          );
          return [
            {
              model: this.options.schemaStore.getModel(attribute.entity),
              as: this.options.schemaStore.getRelationAlias(
                schema.collectionName ?? schema.logicalName,
                x.field,
                lookupSchema.collectionName ?? lookupSchema.logicalName,
              ),
            },
            lookupSchema.primaryAttribute as string,
            x.order.toUpperCase(),
          ];
        }
        return [x.field, x.order.toUpperCase()];
      }) ?? [];

    const records = await model.findAll({
      where: whereClause.length ? { [Op.and]: whereClause } : undefined,
      attributes: this.prepareAttributes({
        logicalName,
        columns: params.columns,
      }),
      include: includes,
      limit: params.limit ?? 100,
      offset: params.skip ?? 0,
      order: order,
    });

    const count = await model.count({
      where: whereClause.length ? { [Op.and]: whereClause } : undefined,
      include: includes,
    });

    const transformedRecords = this.transformRecords(records, {
      schema,
      columns: params.columns,
      expand: params.expand,
    });

    return {
      logicalName,
      records: transformedRecords as Data<T>[],
      count: count,
    };
  }

  protected async deleteRecord(
    params: DeleteRecordParams,
  ): Promise<DeleteRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    const existingRecords = await model.findAll({
      where: this.prepareWhereClause({
        filter: {
          type: 'and',
          conditions: [
            {
              field: schema.idAttribute as string,
              operator: 'eq',
              value: params.id,
            },
          ],
        },
        logicalName: params.logicalName,
        search: null,
      }),
      attributes: {
        exclude: [],
      },
    });

    if (!existingRecords.length) {
      throw new NotFoundError('Record not found');
    }

    const record = existingRecords[0].toJSON();

    let dependedRecordToBeDeleted: DependentRecord[] =
      await this.getDependentRecordsToDelete(
        schema.logicalName,
        record[schema.idAttribute],
      );

    if (dependedRecordToBeDeleted.length) {
      for (const { logicalName, id, record } of dependedRecordToBeDeleted) {
        const schema = this.options.schemaStore.getSchema(logicalName);
        const model = this.options.schemaStore.getModel(logicalName);

        await this.options.pluginStore?.execute({
          logicalName,
          messageName: MessageName.Delete,
          stage: ExecutionStage.PreOperation,
          data: record,
          changedValues: {},
          snapshot: record,
          dbContext: {
            session: this.session,
          },
          sdkContext: this.options.context,
        });

        await model.destroy({
          where: {
            [schema.idAttribute as string]: id,
          },
          transaction: this.session,
        });

        await this.options.pluginStore?.execute({
          logicalName,
          messageName: MessageName.Delete,
          stage: ExecutionStage.PostOperation,
          data: record,
          changedValues: {},
          snapshot: null,
          dbContext: {
            session: this.session,
          },
          sdkContext: this.options.context,
        });
      }
    }

    await this.options.pluginStore?.execute({
      logicalName: schema.logicalName,
      messageName: MessageName.Delete,
      stage: ExecutionStage.PreOperation,
      data: record,
      changedValues: {},
      snapshot: record,
      dbContext: {
        session: this.session,
      },
      sdkContext: this.options.context,
    });

    await model.destroy({
      where: {
        [schema.idAttribute as string]: params.id,
      },
      transaction: this.session,
    });

    await this.options.pluginStore?.execute({
      logicalName: schema.logicalName,
      messageName: MessageName.Delete,
      stage: ExecutionStage.PostOperation,
      data: record,
      changedValues: {},
      snapshot: null,
      dbContext: {
        session: this.session,
      },
      sdkContext: this.options.context,
    });

    return {
      logicalName: params.logicalName,
      id: params.id,
    };
  }

  protected async createRecord(
    params: CreateRecordParams,
  ): Promise<CreateRecordResult> {
    if (!this.session) {
      throw new Error('Session is not started');
    }

    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    let data = params.data;

    data = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const attribute = schema.attributes[key];

        if (!attribute) {
          return acc;
        }

        if (attribute.systemDefined) {
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

          acc[key] = value;
        } else {
          acc[key] = value;
        }

        if (attribute.type === 'regarding') {
          acc[key] = value.id;
          acc[attribute.entityTypeAttribute] = value.logicalName;
        }

        if (schema.attributes[key]?.type === 'attachment') {
          if (typeof value === 'object') {
            acc[key] = value.url;
          } else if (typeof value === 'string') {
            acc[key] = value;
          }
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    const schemaDefaultValues = this.getSchemaDefaultValues(schema);

    data = { ...schemaDefaultValues, ...data };

    if (this.options.defaultValueProvider) {
      const [defaultValues, overrideValues] =
        this.options.defaultValueProvider.getDefaultValues({
          data,
          schema,
        });

      data = { ...defaultValues, ...data, ...overrideValues };
    }

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

    const record = await model.create(data, { transaction: this.session });

    changedValues = this.getChangedValues({}, data);

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      messageName: MessageName.Create,
      stage: ExecutionStage.PostOperation,
      data: record.toJSON(),
      changedValues,
      snapshot: record.toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    return {
      id: record.toJSON()[schema.idAttribute as string],
      logicalName: params.logicalName,
    };
  }

  protected async updateRecord(
    params: UpdateRecordParams,
  ): Promise<UpdateRecordResult> {
    const model = this.options.schemaStore.getModel(params.logicalName);
    const schema = this.options.schemaStore.getSchema(params.logicalName);

    if (schema.restrictions?.disableUpdate) {
      throw new ForbiddenError('Updating is disabled for this entity');
    }

    const data = Object.entries(params.data).reduce(
      (acc, [key, value]) => {
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

        if (attribute.type === 'regarding') {
          acc[key] = value.id;
          acc[attribute.entityTypeAttribute] = value.logicalName;
        }

        if (schema.attributes[key]?.type === 'attachment') {
          if (typeof value === 'object') {
            acc[key] = value.url;
          } else if (typeof value === 'string') {
            acc[key] = value;
          }
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    const existingRecords = await model.findAll({
      where: this.prepareWhereClause({
        filter: {
          type: 'and',
          conditions: [
            {
              field: schema.idAttribute as string,
              operator: 'eq',
              value: params.id,
            },
          ],
        },
        logicalName: params.logicalName,
        search: null,
      }),
      attributes: {
        exclude: [],
      },
    });

    if (!existingRecords.length) {
      throw new NotFoundError('Record not found');
    }

    let changedValues = this.getChangedValues(
      existingRecords[0].toJSON(),
      data,
    );

    await this.options.pluginStore?.execute({
      logicalName: params.logicalName,
      messageName: MessageName.Update,
      stage: ExecutionStage.PreOperation,
      data,
      changedValues,
      snapshot: existingRecords[0].toJSON(),
      sdkContext: this.options.context,
      dbContext: {
        session: this.session,
      },
    });

    const [numberOfAffectedRows] = await model.update(data, {
      transaction: this.session,
      where: {
        [schema.idAttribute as string]: params.id,
      },
    });

    if (!numberOfAffectedRows) {
      console.warn('No rows affected');
    }

    const updatedRecord = await model.findByPk(params.id, {
      transaction: this.session,
      attributes: {
        exclude: [],
      },
    });

    changedValues = this.getChangedValues(existingRecords[0].toJSON(), data);

    await this.options.pluginStore?.execute({
      logicalName: schema.logicalName,
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

    return {
      id: params.id,
      logicalName: params.logicalName,
    };
  }

  private transformRecords<SA extends SchemaAttributes>(
    records: Model<any, any>[],
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
        schemaStore: this.options
          .schemaStore as unknown as SequelizeSchemaStore,
        columns,
        expand,
      }),
    );
  }

  protected async getDependentRecordsToDelete(logicalName: string, id: Id) {
    const schema = this.options.schemaStore.getSchema(logicalName);
    const dependedAttributes = this.getDependedAttributes(schema);

    const dependedRecordsResult: DependentRecord[] = [];

    for (const {
      attributeName,
      schemaLogicalName,
      behavior,
    } of dependedAttributes) {
      const dependedModel =
        this.options.schemaStore.getModel(schemaLogicalName);

      const dependedRecords = await dependedModel.findAll({
        where: {
          [attributeName]: id,
        },
        attributes: [schema.idAttribute as string],
        transaction: this.session,
      });

      if (!dependedRecords.length) {
        continue;
      }

      const filteredDependedRecords = await dependedModel.findAll({
        where: this.prepareWhereClause({
          filter: {
            type: 'and',
            conditions: [
              {
                field: attributeName,
                operator: 'eq',
                value: id,
              },
            ],
          },
          logicalName: schemaLogicalName,
          search: null,
        }),
        attributes: [schema.idAttribute as string],
        transaction: this.session,
      });

      if (filteredDependedRecords.length !== dependedRecords.length) {
        throw new ConflictError('Record is being used in another record');
      }

      if (behavior === 'dependent') {
        dependedRecordsResult.push(
          ...dependedRecords.map((record) => ({
            logicalName: schemaLogicalName,
            id: record.toJSON()[schema.idAttribute as string],
            record: record.toJSON(),
          })),
        );
        continue;
      }

      throw new ConflictError('Record is being used in another record');
    }

    return dependedRecordsResult;
  }

  /** @todo unfinished code */
  protected async retriveAggregate<T = unknown>(
    query: AggregateQuery,
  ): Promise<T[]> {
    const model = this.options.schemaStore.getModel(query.logicalName);

    const { attributes, groupBy, includes, orders } =
      this.prepareAggreate(query);

    const whereClause = this.prepareWhereClause({
      logicalName: query.logicalName,
      filter: query.filter,
      search: null,
    });

    const records = await model.findAll({
      attributes: attributes,
      group: groupBy,
      order: orders,
      include: includes,
      where: whereClause.length ? { [Op.and]: whereClause } : undefined,
      limit: query.limit ?? 100,
    });

    if (query.reverse) {
      records.reverse();
    }

    return records.map((x) => x.toJSON());
  }

  private resolveAggregateValue(
    value: AggregateAttributeValue,
    {
      includes,
      schema,
    }: {
      includes: Record<string, any>;
      schema: Schema<SA>;
    },
  ): string | Literal | Fn | Col {
    switch (value.type) {
      case 'constant':
        return Sequelize.literal(value.value.toString());
      case 'column': {
        if (!value.expandedKey) {
          return Sequelize.col(`${schema.logicalName}.${value.value}`);
        }

        const attribute = schema.attributes[value.value];
        if (!attribute) {
          throw new Error('Invalid attribute');
        }

        if (attribute.type !== 'lookup') {
          throw new Error('Attribute is not lookup');
        }

        // const lookupSchema = this.options.schemaStore.getSchema(
        //   attribute.entity
        // );

        const lookupSchema = this.options.schemaStore.getSchema(
          attribute.entity,
        );

        const alias = this.options.schemaStore.getRelationAlias(
          schema.collectionName ?? schema.logicalName,
          value.value,
          lookupSchema.collectionName ?? lookupSchema.logicalName,
        );

        if (!includes[alias]) {
          includes[alias] = {
            model: this.options.schemaStore.getModel(attribute.entity),
            as: alias,
            attributes: [],
          };
        }

        return Sequelize.col(`${alias}.${value.expandedKey}`);
      }
      case 'function':
        switch (value.value) {
          case 'week_day':
            if (value.params.length !== 1) {
              throw new Error('Invalid params');
            }

            return Sequelize.fn(
              'DATE_PART',
              'dow',
              this.resolveAggregateValue(value.params[0], {
                includes,
                schema,
              }),
            );
          case 'date':
            if (value.params.length !== 1) {
              throw new Error('Invalid params');
            }

            return Sequelize.fn(
              'TO_CHAR',
              this.resolveAggregateValue(value.params[0], {
                includes,
                schema,
              }),
              'YYYY-MM-DD',
            );
          case 'year_month':
            return Sequelize.fn(
              'TO_CHAR',
              this.resolveAggregateValue(value.params[0], {
                includes,
                schema,
              }),
              'YYYY-MM',
            );
        }
        break;
    }

    throw new Error('Invalid value');
  }

  private prepareAggreate(query: AggregateQuery) {
    const schema = this.options.schemaStore.getSchema(query.logicalName);

    const attributes: ProjectionAlias[] = [];
    const groupBy: GroupOption = [];
    const includes: Record<string, any> = {};

    Object.entries(query.attributes).forEach(([key, value]) => {
      const aggregateValue = this.resolveAggregateValue(value.value, {
        includes,
        schema,
      });

      switch (value.aggregate) {
        case false:
          groupBy.push(aggregateValue as string | Fn | Col);
          attributes.push([aggregateValue, key]);
          break;
        case AggregateType.Count:
          attributes.push([
            Sequelize.cast(Sequelize.fn('COUNT', aggregateValue), 'INT'),
            key,
          ]);
          break;
        default:
          throw new Error('Invalid aggregate');
      }
    });

    const orders: OrderItem[] =
      query.orders?.map((x) => [x.field, x.order.toUpperCase()]) ?? [];

    return {
      attributes,
      groupBy,
      includes: Object.values(includes),
      orders,
    };
  }
}

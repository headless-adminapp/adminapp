import type { Attribute } from '@headless-adminapp/core';
import type { Schema } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import type { ExpandOptions } from '@headless-adminapp/core/transport/operations/RetriveRecords';
import type { PipelineStage } from 'mongoose';

import type { MongoRequiredSchemaAttributes } from './types';

function isEmptyExpandInfo(
  expandInfo: ExpandOptions<Record<string, unknown>>[string],
) {
  if (Array.isArray(expandInfo)) {
    return expandInfo.length === 0;
  }

  return (
    !expandInfo?.columns?.length &&
    !Object.keys(expandInfo?.expand ?? {}).length
  );
}

interface LookupPipelineBuilderOptions<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
> {
  includeSearchable?: boolean;
  columns?: string[];
  expandedKeys?: string[];
  expand?: ExpandOptions<Record<string, unknown>>;
  schema: Schema<SA>;
  schemaStore: ISchemaStore<SA>;
}

export class LookupPipelineBuilder<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
> {
  private readonly includedAliases = new Set<string>();
  private finished = false;
  private lookupPipelines: PipelineStage[] = [];
  constructor(private readonly options: LookupPipelineBuilderOptions<SA>) {}

  public build() {
    if (this.finished) {
      return this.lookupPipelines;
    }

    // build lookup pipelines based on columns, expand and searchable attributes
    this.addSearchableAttributes();
    this.addColumnAttributes();
    this.addExpandedKeysAttributes();
    this.addExpandAttributes();

    this.finished = true;

    return this.lookupPipelines;
  }

  private getExpandAlias(field: string, entity: string, parentAlias?: string) {
    if (parentAlias) {
      return `${parentAlias}.@expand.${field}.${entity}`;
    }
    return `@expand.${field}.${entity}`;
  }

  private addLookupPipeline(from: string, localField: string, alias: string) {
    if (this.includedAliases.has(alias)) {
      return;
    }

    this.lookupPipelines.push({
      $lookup: {
        from,
        localField,
        foreignField: '_id',
        as: alias,
      },
    });
    this.lookupPipelines.push({
      $unwind: {
        path: `$${alias}`,
        preserveNullAndEmptyArrays: true,
      },
    });

    this.includedAliases.add(alias);
  }

  private addAttribute({
    attribute,
    attributeName: key,
    parentAlias,
  }: {
    attribute: Attribute;
    attributeName: string;
    parentAlias?: string;
  }): string[] {
    if (attribute.type === 'lookup') {
      const alias = this.getExpandAlias(key, attribute.entity, parentAlias);
      this.addLookupPipeline(attribute.entity, key, alias);
      return [alias];
    } else if (attribute.type === 'regarding') {
      const aliases: string[] = [];
      for (const entity of attribute.entities) {
        const alias = this.getExpandAlias(key, entity, parentAlias);
        this.addLookupPipeline(entity, key, alias);
        aliases.push(alias);
      }
      return aliases;
    }

    return [];
  }

  private addSearchableAttributes() {
    if (!this.options.includeSearchable) return;

    Object.entries(this.options.schema.attributes).forEach(
      ([attributeName, attribute]) => {
        if (!attribute.searchable) return;

        this.addAttribute({
          attribute,
          attributeName,
        });
      },
    );
  }

  private addColumnAttributes() {
    if (!this.options.columns?.length) return;

    this.options.columns.forEach((column) => {
      const attribute = this.options.schema.attributes[column];

      if (!attribute) return;

      this.addAttribute({
        attribute,
        attributeName: column,
      });
    });
  }

  private addExpandedKeysAttributes() {
    if (!this.options.expandedKeys?.length) return;

    this.options.expandedKeys.forEach((key) => {
      const attribute = this.options.schema.attributes[key];
      if (!attribute) return;

      this.addAttribute({
        attribute,
        attributeName: key,
      });
    });
  }

  private addExpandAttribute({
    attributeName,
    expandInfo,
    schema,
    parentAlias,
  }: {
    attributeName: string;
    expandInfo?: ExpandOptions<Record<string, unknown>>[string];
    schema: Schema<SA>;
    parentAlias?: string;
  }) {
    const attribute = schema.attributes[attributeName];

    if (!attribute) return;
    if (!expandInfo) return;
    if (isEmptyExpandInfo(expandInfo)) return;

    this.addAttribute({
      attribute,
      attributeName,
      parentAlias,
    });

    if (!Array.isArray(expandInfo) && expandInfo.expand) {
      // nested expand
      if (attribute.type === 'lookup') {
        const nestedSchema = this.options.schemaStore.getSchema(
          attribute.entity,
        );
        Object.entries(expandInfo.expand).forEach(
          ([nestedKey, nestedExpandInfo]) => {
            this.addExpandAttribute({
              attributeName: nestedKey,
              expandInfo: nestedExpandInfo,
              schema: nestedSchema,
              parentAlias: this.getExpandAlias(
                attributeName,
                attribute.entity,
                parentAlias,
              ),
            });
          },
        );
      } else if (attribute.type === 'regarding') {
        for (const entity of attribute.entities) {
          const nestedSchema = this.options.schemaStore.getSchema(entity);
          Object.entries(expandInfo.expand).forEach(
            ([nestedKey, nestedExpandInfo]) => {
              this.addExpandAttribute({
                attributeName: nestedKey,
                expandInfo: nestedExpandInfo,
                schema: nestedSchema,
                parentAlias: this.getExpandAlias(
                  attributeName,
                  entity,
                  parentAlias,
                ),
              });
            },
          );
        }
      }
    }
  }

  private addExpandAttributes() {
    if (!this.options.expand) return;

    Object.entries(this.options.expand).forEach(
      ([attributeName, expandInfo]) => {
        this.addExpandAttribute({
          attributeName,
          expandInfo,
          schema: this.options.schema,
        });
      },
    );
  }
}

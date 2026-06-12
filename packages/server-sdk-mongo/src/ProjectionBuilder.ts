import type { Schema } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import type { ExpandOptions } from '@headless-adminapp/core/transport/operations/RetriveRecords';
import type { PipelineStage } from 'mongoose';

import type { MongoRequiredSchemaAttributes } from './types';

interface ProjectionPipelineStageBuilderOptions<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
> {
  columns?: string[];
  expand?: ExpandOptions<Record<string, unknown>>;
  schema: Schema<SA>;
  schemaStore: ISchemaStore<SA>;
}

export class ProjectionPipelineStageBuilder<
  SA extends MongoRequiredSchemaAttributes = MongoRequiredSchemaAttributes,
> {
  private finished = false;
  private projection: PipelineStage.Project = {
    $project: {},
  };

  constructor(
    private readonly options: ProjectionPipelineStageBuilderOptions<SA>,
  ) {}

  public build() {
    if (this.finished) {
      return this.projection;
    }

    if (this.options.columns?.length) {
      // Transformer will handle projection of specified columns
      // So do nothing here
    } else {
      this.projection.$project = {
        _id: 1,
        [this.options.schema.primaryAttribute]: 1,
      };
    }

    this.finished = true;

    return this.projection;
  }
}

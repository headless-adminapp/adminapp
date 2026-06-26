import type { SchemaAttributes } from '@headless-adminapp/core/schema';

import type {
  BoardColumnConfig,
  BoardColumnLaneConfig,
  BoardConfig,
  LaneResolverFunction,
  LaneUpdateFunction,
} from './types';

export function defineBoardConfig<
  S extends SchemaAttributes = SchemaAttributes,
>(config: BoardConfig<S>) {
  return config;
}

type DefineColumnConfigOptions = Omit<
  BoardColumnConfig,
  'laneResolver' | 'lanes'
> &
  (
    | {
        laneResolver: string | LaneResolverFunction;
        lanes: BoardColumnLaneConfig[];
      }
    | {
        updateFn: LaneUpdateFunction;
      }
  );

export function defineColumnConfig(
  config: DefineColumnConfigOptions,
): BoardColumnConfig {
  if ('laneResolver' in config && 'lanes' in config) {
    let laneResolver = config.laneResolver;

    if (typeof laneResolver === 'string') {
      laneResolver = () => config.laneResolver as string;
    }

    return {
      ...config,
      laneResolver,
    };
  }

  const laneResolver = () => config.columnId;
  const lanes: BoardColumnLaneConfig[] = [
    {
      id: config.columnId,
      title: config.title,
      updateFn: config.updateFn,
    },
  ];
  return {
    ...config,
    laneResolver,
    lanes,
  };
}

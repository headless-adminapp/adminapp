import { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import {
  EntityMainGridCommandItemExperience,
  View,
} from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';

import { useExperienceView } from '../../metadata/hooks/useExperienceView';
import { useExperienceViewCommands } from '../../metadata/hooks/useExperienceViewCommands';
import { useExperienceViewLookup } from '../../metadata/hooks/useExperienceViewLookup';
import { useSchema } from '../../metadata/hooks/useSchema';

type UseLoadMainGridPageResult =
  | {
      loading: true;
    }
  | {
      loading: false;
      error: true;
      title: string;
      message: string;
    }
  | {
      loading: false;
      error: false;
      schema: Schema;
      viewLookup: LocalizedDataLookup[];
      commands: EntityMainGridCommandItemExperience[][];
      view: View;
    };

export function useLoadMainGridPage(
  logicalName: string,
  viewId: string | undefined
): UseLoadMainGridPageResult {
  const schema = useSchema(logicalName);

  const { viewLookup } = useExperienceViewLookup(logicalName);
  const { commands } = useExperienceViewCommands(logicalName);

  const { view, isLoadingView } = useExperienceView(logicalName, viewId);

  if (!schema) {
    return {
      loading: false,
      error: true,
      title: 'Schema not found',
      message: `The schema "${logicalName}" was not found`,
    };
  }

  if (!view) {
    if (isLoadingView) {
      return {
        loading: true,
      };
    }

    return {
      loading: false,
      error: true,
      title: 'View not found',
      message: `The view was not found for schema "${schema.logicalName}"`,
    };
  }

  if (view.logicalName !== schema.logicalName) {
    if (isLoadingView) {
      return {
        loading: true,
      };
    }

    return {
      loading: false,
      error: true,
      title: 'View not found',
      message: 'The view was not found (missmatch)',
    };
  }

  return {
    loading: false,
    error: false,
    schema,
    viewLookup,
    commands,
    view,
  };
}

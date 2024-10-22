import { Body1, Spinner } from '@fluentui/react-components';
import { DataGridProvider } from '@headless-adminapp/app/datagrid/DataGridProvider';
import {
  useExperienceView,
  useExperienceViewCommands,
  useExperienceViewLookup,
  useExperienceViewSubgridCommands,
  useSchema,
} from '@headless-adminapp/app/metadata/hooks';
import { Filter } from '@headless-adminapp/core/transport';
import { useMemo, useState } from 'react';

import { FormSubgridContainer } from '../PageEntityView/FormSubgridContainer';

interface SubgridControlProps {
  logicalName: string;
  allowViewSelection?: boolean;
  viewId?: string;
  availableViewIds?: string[];
  associated:
    | false
    | {
        logicalName: string;
        id: string;
        refAttributeName: string;
      };
}

export function SubgridControl(props: SubgridControlProps) {
  const schema = useSchema(props.logicalName);

  const [viewId, setViewId] = useState<string | undefined>(props.viewId);

  const { view, isLoadingView } = useExperienceView(
    props.logicalName,
    viewId,
    !!props.associated,
    props.availableViewIds
  );
  const { viewLookup } = useExperienceViewLookup(
    props.logicalName,
    !!props.associated,
    props.availableViewIds
  );
  const { commands } = useExperienceViewCommands(props.logicalName);
  const { commands: subgridCommands } = useExperienceViewSubgridCommands(
    props.logicalName
  );

  const extraFilter: Filter | undefined = useMemo(() => {
    if (!props.associated) {
      return undefined;
    }

    return {
      type: 'and',
      conditions: [
        {
          field: props.associated.refAttributeName,
          operator: 'eq',
          value: props.associated.id,
        },
      ],
    };
  }, [props.associated]);

  const loadingContent = (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
    </div>
  );

  const brokenContent = (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <Body1>Unable to load control</Body1>
    </div>
  );

  if (!schema) {
    return brokenContent;
  }

  if (!view) {
    if (isLoadingView) {
      return loadingContent;
    }

    return brokenContent;
  }

  if (view.logicalName !== schema.logicalName) {
    if (isLoadingView) {
      console.log('missmatched view', view, schema);
      return loadingContent;
    }

    return brokenContent;
  }

  return (
    <DataGridProvider
      schema={schema}
      view={view}
      views={viewLookup}
      onChangeView={setViewId}
      commands={(props.associated ? subgridCommands : commands) as any}
      isSubGrid={props.associated ? true : false}
      extraFilter={extraFilter}
      allowViewSelection={props.allowViewSelection ?? false}
    >
      <FormSubgridContainer />
    </DataGridProvider>
  );
}

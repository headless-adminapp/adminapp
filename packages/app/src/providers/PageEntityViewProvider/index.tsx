import { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import {
  EntityMainGridCommandItemExperience,
  View,
} from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { PropsWithChildren } from 'react';

import { DataGridProvider } from '../../datagrid/DataGridProvider';

interface PageEntityViewProviderProps<S extends SchemaAttributes> {
  schema: Schema<S>;
  view: View<S>;
  commands: EntityMainGridCommandItemExperience[][];
  availableViews: LocalizedDataLookup[];
  onChangeView: (viewId: string) => void;
}

export function PageEntityViewProvider<S extends SchemaAttributes>({
  availableViews,
  commands,
  schema,
  view,
  children,
  onChangeView,
}: PropsWithChildren<PageEntityViewProviderProps<S>>) {
  return (
    <DataGridProvider
      schema={schema}
      view={view}
      views={availableViews}
      onChangeView={onChangeView}
      commands={commands}
      allowViewSelection
    >
      {children}
    </DataGridProvider>
  );
}

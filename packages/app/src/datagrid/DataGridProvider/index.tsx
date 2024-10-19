import { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import {
  EntityMainGridCommandContext,
  EntitySubGridCommandContext,
  View,
} from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { useLocale } from '../../locale/useLocale';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { ContextValue, useCreateContextStore } from '../../mutable/context';
import { GridContext, GridContextState } from '../context';
import { DataResolver } from './DataResolver';
import { transformViewColumns } from './transformViewColumns';

export interface DataGridProviderProps<
  S extends SchemaAttributes = SchemaAttributes,
  CommandContext extends
    | EntityMainGridCommandContext
    | EntitySubGridCommandContext = EntityMainGridCommandContext
> {
  schema: Schema<S>;
  views: LocalizedDataLookup[];
  view: View<S>;
  extraFilter?: Filter;
  commands: CommandItemExperience<CommandContext>[][];
  onChangeView: (viewId: string) => void;
  isSubGrid?: boolean;
  allowViewSelection?: boolean;
  maxRecords?: number;
}

export function DataGridProvider<
  S extends SchemaAttributes = SchemaAttributes,
  CommandContext extends
    | EntityMainGridCommandContext
    | EntitySubGridCommandContext = EntityMainGridCommandContext
>(props: PropsWithChildren<DataGridProviderProps<S, CommandContext>>) {
  const onChangeViewRef = useRef(props.onChangeView);
  onChangeViewRef.current = props.onChangeView;
  const { schemaStore } = useMetadata();
  const [{ language }] = useLocale();

  const handleViewChange = useCallback((viewId: string) => {
    onChangeViewRef.current(viewId);
  }, []);

  const contextValue = useCreateContextStore<
    GridContextState<S, CommandContext>
  >({
    schema: props.schema,
    columnFilters: {},
    data: {
      logicalName: props.schema.logicalName,
      records: [],
      count: 0,
    },
    searchText: '',
    selectedIds: [],
    sorting: props.view.experience.defaultSorting ?? [],
    view: props.view,
    commands: props.commands,
    columns: transformViewColumns(
      props.view.logicalName,
      props.view.experience.grid.columns,
      schemaStore,
      language
    ),
    viewLookup: props.views,
    extraFilter: props.extraFilter,
    dataState: {
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    },
    fetchNextPage: () => {},
    onChangeView: handleViewChange,
    isSubGrid: props.isSubGrid ?? false,
    allowViewSelection: props.allowViewSelection ?? false,
    maxRecords: props.maxRecords,
  });

  useEffect(() => {
    contextValue.setValue({
      view: props.view,
      searchText: '',
      selectedIds: [],
      sorting: props.view.experience.defaultSorting ?? [],
      columns: transformViewColumns(
        props.view.logicalName,
        props.view.experience.grid.columns,
        schemaStore,
        language
      ),
      maxRecords: props.maxRecords,
    });
  }, [props.view, props.maxRecords, contextValue, schemaStore, language]);

  useEffect(() => {
    contextValue.setValue({
      schema: props.schema,
      searchText: '',
      selectedIds: [],
    });
  }, [props.schema, contextValue]);

  useEffect(() => {
    contextValue.setValue({
      extraFilter: props.extraFilter,
    });
  }, [props.extraFilter, contextValue]);

  useEffect(() => {
    contextValue.setValue({
      commands: props.commands,
    });
  }, [props.commands, contextValue]);

  return (
    <GridContext.Provider
      value={
        contextValue as unknown as ContextValue<
          GridContextState<SchemaAttributes>
        >
      }
    >
      <DataResolver />
      {props.children}
    </GridContext.Provider>
  );
}

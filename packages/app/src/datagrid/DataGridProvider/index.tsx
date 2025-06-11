import { useRouter } from '@headless-adminapp/app/route';
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
import { useUpdateEffect } from 'react-use';

import { useHistoryStateKey } from '../../historystate';
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
  onChangeView?: (viewId: string) => void;
  isSubGrid?: boolean;
  associated?:
    | false
    | {
        logicalName: string;
        id: string;
        refAttributeName: string;
      };
  allowViewSelection?: boolean;
  maxRecords?: number;
  disabled?: boolean;
}

function mergeInitialStateWithHistory<T>(
  initialValue: T,
  historyState: Partial<T> | undefined
): T {
  return {
    ...initialValue,
    ...historyState,
  };
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
  const { language } = useLocale();
  const router = useRouter();

  const handleViewChange = useCallback((viewId: string) => {
    onChangeViewRef.current?.(viewId);
  }, []);

  const historyKey = useHistoryStateKey();

  const contextValue = useCreateContextStore<
    GridContextState<S, CommandContext>
  >(() =>
    mergeInitialStateWithHistory(
      {
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
        quickFilterValues:
          props.view.experience.quickFilter?.defaultValues ?? {},
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
        associated: props.associated,
        disabled: props.disabled ?? false,
      },
      router.getState<Partial<GridContextState<S, CommandContext>>>(historyKey)
    )
  );

  useEffect(() => {
    function listener(
      state: GridContextState<S, CommandContext>,
      prevState: GridContextState<S, CommandContext>,
      changes: Partial<GridContextState<S, CommandContext>>
    ) {
      if (
        ['searchText', 'columnFilters', 'sorting', 'columns'].some(
          (key) => key in changes
        )
      ) {
        router.setState(historyKey, {
          searchText: state.searchText,
          columnFilters: state.columnFilters,
          sorting: state.sorting,
          columns: state.columns,
        });
      }
    }

    contextValue.addListener(listener);
    return () => {
      contextValue.removeListener(listener);
    };
  }, [contextValue, historyKey, router]);

  useUpdateEffect(() => {
    contextValue.setValue({
      view: props.view,
      searchText: '',
      selectedIds: [],
      sorting: props.view.experience.defaultSorting ?? [],
      quickFilterValues: props.view.experience.quickFilter?.defaultValues ?? {},
      columns: transformViewColumns(
        props.view.logicalName,
        props.view.experience.grid.columns,
        schemaStore,
        language
      ),
      maxRecords: props.maxRecords,
    });
  }, [props.view, props.maxRecords, contextValue, schemaStore, language]);

  useUpdateEffect(() => {
    contextValue.setValue({
      schema: props.schema,
      searchText: '',
      selectedIds: [],
    });
  }, [props.schema, contextValue]);

  useUpdateEffect(() => {
    contextValue.setValue({
      extraFilter: props.extraFilter,
    });
  }, [props.extraFilter, contextValue]);

  useUpdateEffect(() => {
    contextValue.setValue({
      commands: props.commands,
    });
  }, [props.commands, contextValue]);

  useUpdateEffect(() => {
    contextValue.setValue({
      isSubGrid: props.isSubGrid ?? false,
      associated: props.associated,
    });
  }, [props.isSubGrid, props.associated, contextValue]);

  useEffect(() => {
    contextValue.setValue({
      disabled: props.disabled ?? false,
    });
  }, [props.disabled, contextValue]);

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

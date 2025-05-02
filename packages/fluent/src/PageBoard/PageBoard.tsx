import { tokens } from '@fluentui/react-components';
import {
  BoardContext,
  BoardContextState,
} from '@headless-adminapp/app/board/context';
import { BoardConfig } from '@headless-adminapp/app/board/types';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import {
  ContextValue,
  useCreateContextStore,
} from '@headless-adminapp/app/mutable/context';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useEffect } from 'react';

import { DndProvider } from '../components/DndProvider';
import { BoardColumn } from './BoardColumn';
import { Header } from './Header';

interface PageBoardProps<S extends SchemaAttributes = SchemaAttributes> {
  config: BoardConfig<S>;
}

export function PageBoard<S extends SchemaAttributes = SchemaAttributes>(
  props: Readonly<PageBoardProps<S>>
) {
  const contextValue = useCreateContextStore<BoardContextState<S>>({
    config: props.config,
    searchText: '',
    quickFilterValues: props.config.quickFilter?.defaultValues ?? {},
  });

  useEffect(() => {
    contextValue.setValue({
      config: props.config,
      searchText: '',
      quickFilterValues: props.config.quickFilter?.defaultValues ?? {},
    });
  }, [contextValue, props.config]);

  return (
    <BoardContext.Provider
      value={contextValue as unknown as ContextValue<BoardContextState>}
    >
      <DndProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: tokens.spacingVerticalM,
            padding: tokens.spacingHorizontalM,
            background: tokens.colorNeutralBackground2,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: tokens.colorNeutralBackground1,
                borderRadius: tokens.borderRadiusLarge,
                paddingBlock: tokens.spacingVerticalM,
                paddingInline: tokens.spacingHorizontalM,
                gap: tokens.spacingVerticalM,
                boxShadow: tokens.shadow4,
              }}
            >
              <Header
                title={props.config.title}
                subtitle={props.config.description}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              marginInline: -6,
              marginTop: tokens.spacingVerticalM,
            }}
          >
            <ScrollView>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flex: 1,
                  height: '100%',
                }}
              >
                {props.config.columnConfigs.map((config) => (
                  <BoardColumn key={config.columnId} config={config} />
                ))}
              </div>
            </ScrollView>
          </div>
        </div>
      </DndProvider>
    </BoardContext.Provider>
  );
}

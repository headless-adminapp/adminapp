import { tokens } from '@fluentui/react-components';
import {
  BoardContext,
  BoardContextState,
} from '@headless-adminapp/app/board/context';
import { BoardConfig } from '@headless-adminapp/app/board/types';
import {
  ContextValue,
  useCreateContextStore,
} from '@headless-adminapp/app/mutable/context';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BoardColumn } from './BoardColumn';
import { Header } from './Header';

interface PageBoardProps<S extends SchemaAttributes = SchemaAttributes> {
  config: BoardConfig<S>;
}

export function PageBoard<S extends SchemaAttributes = SchemaAttributes>(
  props: PageBoardProps<S>
) {
  const contextValue = useCreateContextStore<BoardContextState<S>>({
    config: props.config,
    searchText: '',
  });

  useEffect(() => {
    contextValue.setValue({
      config: props.config,
      searchText: '',
    });
  }, [contextValue, props.config]);

  return (
    <BoardContext.Provider
      value={contextValue as unknown as ContextValue<BoardContextState>}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: tokens.spacingVerticalM,
            padding: tokens.spacingHorizontalL,
            background: tokens.colorNeutralBackground3,
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
            {props.config.columnConfigs.map((config) => (
              <BoardColumn key={config.columnId} config={config} />
            ))}
          </div>
        </div>
      </DndProvider>
    </BoardContext.Provider>
  );
}

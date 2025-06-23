import type { BackendFactory } from 'dnd-core';
import {
  createContext,
  FC,
  lazy,
  PropsWithChildren,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';
import type * as ReactDndTypes from 'react-dnd';

const DndProviderIntenral = lazy(() =>
  import('react-dnd').then((mod) => ({ default: mod.DndProvider }))
);

let ReactDndPromise: Promise<typeof ReactDndTypes> | null = null;
let HTML5BackendPromise: Promise<BackendFactory> | null = null;

interface DndContextState {
  DndProvider: typeof ReactDndTypes.DndProvider;
  backend: BackendFactory;
  useDrag: typeof ReactDndTypes.useDrag;
  useDrop: typeof ReactDndTypes.useDrop;
}

const DndContext = createContext<DndContextState>(null as any);

export const DndProvider: FC<PropsWithChildren> = ({ children }) => {
  const [context, setContext] = useState<DndContextState | null>(null);

  useEffect(() => {
    HTML5BackendPromise ??= import('react-dnd-html5-backend').then(
      (mod) => mod.HTML5Backend
    );

    ReactDndPromise ??= import('react-dnd');

    Promise.all([HTML5BackendPromise, ReactDndPromise])
      .then(([backend, mod]) => {
        setContext({
          DndProvider: mod.DndProvider,
          backend: backend,
          useDrag: mod.useDrag,
          useDrop: mod.useDrop,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!context) {
    return null;
  }

  return (
    <DndContext.Provider value={context}>
      <Suspense>
        <DndProviderIntenral backend={context.backend}>
          {children}
        </DndProviderIntenral>
      </Suspense>
    </DndContext.Provider>
  );
};

export function useDndContext() {
  const context = useContext(DndContext);

  if (!context) {
    throw new Error('useDndContext must be used within DndProvider');
  }

  return context;
}

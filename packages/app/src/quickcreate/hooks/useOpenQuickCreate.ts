import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { DataLookup, Id } from '@headless-adminapp/core/attributes';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import {
  QuickCreateContext,
  QuickCreateItemState,
  QuickCreateOptions,
} from '../context';

function markAsClosed(items: QuickCreateItemState[], id: string) {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, isOpen: false };
    }

    return item;
  });
}

function excludeItemById(items: QuickCreateItemState[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function useOpenQuickCreate() {
  const setValue = useContextSetValue(QuickCreateContext);

  const openQuickCreate = useCallback(
    (options: Omit<QuickCreateOptions, 'onCreate' | 'onCancel'>) => {
      const id = uuid();

      const close = (id: string) => {
        setValue((state) => ({
          items: markAsClosed(state.items, id),
        }));

        // Simulate a delay to show the dialog closing animation
        setTimeout(() => {
          setValue((state) => ({
            items: excludeItemById(state.items, id),
          }));
        }, 1000);
      };

      return new Promise<DataLookup<Id> | null>((resolve) => {
        setValue((state) => {
          return {
            items: [
              ...state.items,
              {
                ...options,
                id,
                isOpen: true,
                onCancel: () => {
                  close(id);
                  resolve(null);
                },
                onCreate: (value) => {
                  close(id);
                  resolve(value);
                },
              } as QuickCreateItemState,
            ],
          };
        });
      });
    },
    [setValue]
  );

  return openQuickCreate;
}

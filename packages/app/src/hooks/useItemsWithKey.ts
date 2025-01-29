import { ItemWithKey } from '@headless-adminapp/core/types';
import { createItemsWithKey } from '@headless-adminapp/core/utils';
import { useMemo } from 'react';

export function useItemsWithKey<T>(value: T[]): ItemWithKey<T>[];
export function useItemsWithKey(value: null): null;
export function useItemsWithKey(value: undefined): undefined;
export function useItemsWithKey<T>(value: T[] | null): ItemWithKey<T>[] | null;
export function useItemsWithKey<T>(
  value: T[] | undefined
): ItemWithKey<T>[] | undefined;
export function useItemsWithKey<T>(
  value: T[] | null | undefined
): ItemWithKey<T>[] | null | undefined;
export function useItemsWithKey<T>(value: T[] | null | undefined) {
  return useMemo(() => {
    if (!value) {
      return value;
    }

    return createItemsWithKey(value);
  }, [value]);
}

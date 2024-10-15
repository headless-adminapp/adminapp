import { AllowArray } from '../../types';
import { BooleanOrFunction } from './types';

export function checkCommandCondition<T>(
  context: T,
  handlers?: AllowArray<BooleanOrFunction<T>>
): boolean {
  if (!handlers) {
    return false;
  }

  if (Array.isArray(handlers)) {
    return handlers
      .filter((handler) => handler !== undefined)
      .some((handler) =>
        typeof handler === 'function' ? handler(context) : handler
      );
  }

  return typeof handlers === 'function' ? handlers(context) : handlers;
}

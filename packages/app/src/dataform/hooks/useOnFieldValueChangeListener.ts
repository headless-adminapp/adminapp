import { useEffect, useRef } from 'react';

import { EVENT_KEY_ON_FIELD_CHANGE } from '../constants';
import { useEventManager } from './useEventManager';

export function useOnFieldValueChangeListener(
  key: string,
  callback: (value: any) => any
) {
  const eventManager = useEventManager();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const listener = (_key: string, value: unknown) => {
      const _path = _key.split('.');
      const path = key.split('.');

      if (_path.length !== path.length) {
        return;
      }

      for (let i = 0; i < path.length; i++) {
        if (path[i] !== _path[i]) {
          return;
        }
      }

      callbackRef.current(value);
    };

    eventManager.on(EVENT_KEY_ON_FIELD_CHANGE, listener);

    return () => {
      eventManager.off(EVENT_KEY_ON_FIELD_CHANGE, listener);
    };
  }, [key, callback, eventManager]);
}

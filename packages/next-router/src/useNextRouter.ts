import { RouterInstance } from '@headless-adminapp/app/route/context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

let isPushNavigating = false;
let isPatched = false;

const STATE_KEY = '__APP';
const PENDING_STATE_KEY = '__APP_PENDING';

let originalPush: typeof history.pushState;
let originalReplace: typeof history.replaceState;

function patchHistory() {
  originalPush = history.pushState;
  originalReplace = history.replaceState;

  history.pushState = function (state, ...args) {
    if (window.history.state?.[PENDING_STATE_KEY]) {
      originalReplace.call(
        history,
        {
          ...window.history.state,
          [PENDING_STATE_KEY]: undefined,
        },
        ''
      );
      isPushNavigating = false;
    }
    originalPush.call(history, state, ...args);
    window.dispatchEvent(new Event('onPushState'));
  };

  history.replaceState = function (state, ...args) {
    console.log('Patching replaceState', state, args);
    state = {
      ...state,
      [STATE_KEY]: state[STATE_KEY] ?? window.history.state[STATE_KEY],
    };
    originalReplace.call(history, state, ...args);
    window.dispatchEvent(new Event('onReplaceState'));
  };

  isPatched = true;
}

function unpatchHistory() {
  if (!isPatched) return;
  history.pushState = originalPush;
  history.replaceState = originalReplace;
  isPatched = false;
}

export function useNextRouter() {
  const router = useRouter();

  useEffect(() => {
    if (!isPatched) {
      patchHistory();
    }

    return () => {
      unpatchHistory();
      isPushNavigating = false;
    };
  }, []);

  const nextRouter = useMemo(() => {
    const getState: RouterInstance['getState'] = (key?: string) => {
      const stateKey = isPushNavigating ? PENDING_STATE_KEY : STATE_KEY;
      const data = window.history.state[stateKey] ?? {};

      if (key) {
        return data[key];
      }

      return data;
    };

    const setState: RouterInstance['setState'] = (key: any, state?: any) => {
      if (typeof key === 'string') {
        state = {
          ...window.history.state?.[STATE_KEY],
          [key]: state,
        };
      } else {
        state = key;
      }

      window.history.replaceState(
        {
          ...window.history.state,
          [STATE_KEY]: state,
        },
        ''
      );
    };

    return {
      ...router,
      push: (href, options) => {
        isPushNavigating = true;

        if (options?.state) {
          window.history.replaceState(
            {
              ...window.history.state,
              [PENDING_STATE_KEY]: options?.state,
            },
            ''
          );
        }

        router.push(href);

        function onPushState() {
          window.removeEventListener('onPushState', onPushState);
          if (options?.state) {
            window.history.replaceState(
              {
                ...window.history.state,
                [STATE_KEY]: options?.state,
              },
              ''
            );
          }
          isPushNavigating = false;
        }
        window.addEventListener('onPushState', onPushState);
      },
      replace: (href, options) => {
        router.replace(href);
        if (options?.state) {
          window.history.replaceState(
            {
              ...window.history.state,
              [STATE_KEY]: options?.state,
            },
            ''
          );
        }
      },
      getState,
      setState,
    } as RouterInstance;
  }, [router]);

  return nextRouter;
}

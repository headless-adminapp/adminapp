import {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ProgressIndicatorContext } from './context';

export const ProgressIndicatorProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showTimeoutRef = useRef<NodeJS.Timeout>();

  const showProgressIndicator = useCallback(
    (message?: string, delay?: number) => {
      setOverlayVisible(true);
      setMessage(message);

      if (delay) {
        showTimeoutRef.current ??= setTimeout(() => {
          setVisible(true);
          showTimeoutRef.current = undefined;
        }, delay);
      } else {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = undefined;
        }

        setVisible(true);
      }
    },
    []
  );

  const hideProgressIndicator = useCallback(() => {
    setVisible(false);
    setOverlayVisible(false);

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      overlayVisible,
      visible,
      message,
      showProgressIndicator,
      hideProgressIndicator,
    }),
    [
      visible,
      overlayVisible,
      message,
      showProgressIndicator,
      hideProgressIndicator,
    ]
  );

  return (
    <ProgressIndicatorContext.Provider value={contextValue}>
      {children}
    </ProgressIndicatorContext.Provider>
  );
};

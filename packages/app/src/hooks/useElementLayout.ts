import { RefObject, useLayoutEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useElementSize(
  elementRef: RefObject<HTMLElement>,
  interval?: number
) {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function updateSize() {
      if (elementRef.current) {
        const element = elementRef.current;
        const rect = element.getBoundingClientRect();
        setSize((size) => {
          if (size.width === rect.width && size.height === rect.height) {
            return size;
          }

          return { width: rect.width, height: rect.height };
        });
      }
    }

    updateSize();

    let intervalId: NodeJS.Timeout;

    if (interval) {
      intervalId = setInterval(updateSize, interval);
    }

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [elementRef, interval]);

  return size;
}

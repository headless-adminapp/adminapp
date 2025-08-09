import { RefObject, useLayoutEffect, useState } from 'react';

interface ElementLayout {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function useElementSize(
  elementRef: RefObject<HTMLElement>,
  interval?: number
) {
  const [size, setSize] = useState<ElementLayout>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  useLayoutEffect(() => {
    function updateSize() {
      if (elementRef.current) {
        const element = elementRef.current;
        const rect = element.getBoundingClientRect();
        setSize((size) => {
          if (
            size.width === rect.width &&
            size.height === rect.height &&
            size.top === rect.top &&
            size.left === rect.left &&
            size.right === rect.right &&
            size.bottom === rect.bottom
          ) {
            return size;
          }

          return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
          };
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

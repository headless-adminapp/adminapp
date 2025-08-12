import debounce from 'lodash/debounce';
import { useLayoutEffect, useState } from 'react';

function getInnerWidth() {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }

  return 0;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getInnerWidth() < 768);

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsMobile(getInnerWidth() < 768);
    };

    window.addEventListener('resize', debounce(updateSize, 250));
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsTablet(getInnerWidth() < 1024);
    };

    window.addEventListener('resize', debounce(updateSize, 250));
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isTablet;
}

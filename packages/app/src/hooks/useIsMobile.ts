import debounce from 'lodash/debounce';
import { useLayoutEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsMobile(window.innerWidth < 768);
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
      setIsTablet(window.innerWidth < 1024);
    };

    window.addEventListener('resize', debounce(updateSize, 250));
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return isTablet;
}

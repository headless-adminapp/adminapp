'use client';

import debounce from 'lodash/debounce';
import { useLayoutEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

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

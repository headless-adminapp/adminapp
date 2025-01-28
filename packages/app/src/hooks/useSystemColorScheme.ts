import { useEffect, useState } from 'react';

const isSystemDarkMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

export function useSystemColorScheme() {
  const [systemColorScheme, setSystemColorScheme] = useState<'dark' | 'light'>(
    isSystemDarkMode() ? 'dark' : 'light'
  );

  useEffect(() => {
    setSystemColorScheme(isSystemDarkMode() ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemColorScheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return systemColorScheme;
}

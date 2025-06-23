import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue<T = any>(
  value: T,
  wait: number,
  options = { leading: false }
) {
  const [internalValue, setInternalValue] = useState(value);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number>();
  const cooldownRef = useRef(false);

  const cancel = () => window.clearTimeout(timeoutRef.current);

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setInternalValue(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setInternalValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [internalValue, cancel] as const;
}

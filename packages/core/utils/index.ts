export function typeSafeFn<T>() {
  return function <U extends T>(a: U): U {
    return a;
  };
}

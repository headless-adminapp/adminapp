type Listener<T> = (state: T) => void;

export interface MutableValue<T> {
  value: { current: T };
  setValue: (value: Partial<T> | ((state: T) => Partial<T>)) => void;
  listeners: Set<Listener<T>>;
  addListener: (listener: Listener<T>) => void;
  removeListener: (listener: Listener<T>) => void;
}

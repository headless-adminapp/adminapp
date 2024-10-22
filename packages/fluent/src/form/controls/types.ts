export interface ControlProps<T> {
  id?: string;
  name?: string;
  value: T | null;
  onChange?: (value: T | null) => void;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  borderOnFocusOnly?: boolean;
  readOnly?: boolean;
}

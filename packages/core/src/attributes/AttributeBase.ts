import { Localized } from '../types';

export type AttributeBase<T = unknown> = {
  label: string;
  description?: string;
  required?: boolean;
  default?: T;
  searchable?: boolean;
  readonly?: boolean;
  systemDefined?: boolean;
  localizedLabels?: Localized<string>;
  localizedDescriptions?: Localized<string>;
};

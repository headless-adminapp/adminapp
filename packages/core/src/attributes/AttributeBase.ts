import { Localized } from '../types';

/**
 * Base attribute type
 * @description Represents the base structure for all attribute types.
 */
export type AttributeBase<T = unknown> = {
  /** The label for the attribute */
  label: string;
  /** The description of the attribute */
  description?: string;
  /** Indicates if the attribute is required */
  required?: boolean;
  /** The default value of the attribute */
  default?: T;
  /** Indicates if the attribute is searchable */
  searchable?: boolean;
  /** Indicates if the attribute is read-only */
  readonly?: boolean;
  /** Indicates if the attribute is system-defined */
  systemDefined?: boolean;
  /** Localized labels for the attribute */
  localizedLabels?: Localized<string>;
  /** Localized descriptions for the attribute */
  localizedDescriptions?: Localized<string>;
};

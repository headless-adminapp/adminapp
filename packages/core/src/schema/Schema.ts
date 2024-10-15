import { Localized } from '../types';
import { SchemaAttributes } from './SchemaAttributes';

export interface SchemaMetadata {
  logicalName: string;
  label: string;
  pluralLabel: string;
  description?: string;
  localizedLabels?: Localized<string>;
  localizedPluralLabels?: Localized<string>;
  localizedDescriptions?: Localized<string>;
}

export interface Schema<A extends SchemaAttributes = SchemaAttributes>
  extends SchemaMetadata {
  idAttribute: keyof A;
  primaryAttribute: keyof A;
  createdAtAttribute?: keyof A;
  updatedAtAttribute?: keyof A;
  ownership?: 'scoped' | 'global'; // Scoped means user can only see records they have permission to see, global means user can see all records
  additionalMetadata?: Record<string, any>; // Additional metadata
  attributes: A;
  restrictions?: {
    disableCreate?: boolean;
    disableUpdate?: boolean;
    disableDelete?: boolean;
    disableIndex?: boolean;
  };
}

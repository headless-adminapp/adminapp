import { Localized } from '../types';
import { SchemaAttributes } from './SchemaAttributes';

export interface SchemaMetadata {
  logicalName: string;
  collectionName?: string; // Collection name in the database (if different from logical name)
  collectionSetName?: string; // Collection set name in the database
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
  avatarAttribute?: keyof A;
  ownership?: 'scoped' | 'global'; // Scoped means user can only see records they have permission to see, global means user can see all records
  virtual?: boolean; // Not a physical collection and used for query only
  baseSchemaLogicalName?: string; // Base entity for the schema
  baseSchemaLogicalNames?: string[]; // Base entities for the schema (Used to create record)
  virtualLogicalNameAttribute?: keyof A; // Attribute that contains the schema logical name for virtual entities
  additionalMetadata?: Record<string, any>; // Additional metadata
  attributes: A;
  restrictions?: {
    disableCreate?: boolean;
    disableUpdate?: boolean;
    disableDelete?: boolean;
    disableIndex?: boolean;
  };
}

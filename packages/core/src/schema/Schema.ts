import type { Localized } from '../types';
import type { SchemaAttributes } from './SchemaAttributes';

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

/**
 * Schema interface
 * @description Represents the structure and metadata of a schema, including its attributes.
 */
export interface Schema<
  A extends SchemaAttributes = SchemaAttributes,
> extends SchemaMetadata {
  /** Key attribute names */
  idAttribute: Extract<keyof A, string>;
  /** Primary attribute name for display */
  primaryAttribute: Extract<keyof A, string>;
  /** Attribute name for record creation timestamp */
  createdAtAttribute?: Extract<keyof A, string>;
  /** Attribute name for record update timestamp */
  updatedAtAttribute?: Extract<keyof A, string>;
  /** An attachment attribute for avatar */
  avatarAttribute?: Extract<keyof A, string>;
  // Ownership of the schema
  ownership?:
    | 'scoped' // Records are scoped to user or team, only they can see their records
    | 'global'; // Records are global, user can see all records
  // Not a physical collection and used for query only
  virtual?: {
    baseSchemaLogicalName?: string; // Base entity for the schema
    baseSchemaLogicalNames?: string[]; // Base entities for the schema (Used to create record)
    baseSchemaLogicalNameAttribute?: keyof A; // Attribute that contains the schema logical name for virtual entities
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalMetadata?: Record<string, any>; // Additional metadata
  attributes: A; // Attributes of the schema
  restrictions?: {
    disableCreate?: boolean;
    disableUpdate?: boolean;
    disableDelete?: boolean;
    disableIndex?: boolean;
  };
}

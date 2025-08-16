import { InferredSchemaType } from './inferred';
import { SchemaAttributes } from './SchemaAttributes';

// TODO: Improvement required

type CalculationMode = 'client' | 'server' | 'both'; // One more for server side but client will call on-demand request when relatedDeps included
// Basically serverside calculation has two type - always from server side or client will call server to recalculate

export interface CalculatedAttributeInfo<
  S extends SchemaAttributes = SchemaAttributes,
  R extends Record<string, SchemaAttributes> = Record<string, SchemaAttributes>
> {
  logicalName: string;
  attributeName: keyof S;
  deps: Array<keyof S>;
  mode: CalculationMode;
  allowUserToEdit?: boolean;
  relatedDeps?: {
    [K in keyof R]: {
      associatedColumn: keyof R[K];
      columns: Array<keyof R[K]>;
    };
  };
  handler: (
    record: InferredSchemaType<S>,
    related: {
      [K in keyof R]: InferredSchemaType<R[K]>[];
    }
  ) => unknown;
}

// ui logic
// If calculated field included than only do calculation
// If if calculated on UI side and send to backend, still backend might do calculation if mode is both or server

// backend logic
// operation
// If deps field is modified than only trigger for next step
// If deps only on same record than pre operation will consider to update it
// If deps include related records than post operation will consider to update it

// On demand
// An request accept schema and list of fields to calculate

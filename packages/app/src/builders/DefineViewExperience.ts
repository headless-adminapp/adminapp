import type {
  GridView as $GridView,
  ViewColumn as $ViewColumn,
  ViewExperience as $ViewExperience,
} from '@headless-adminapp/core/experience/view';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';

export namespace DefineViewExperience {
  export type Experience<S extends SchemaAttributes = SchemaAttributes> =
    | Pick<
        $ViewExperience<S>,
        'filter' | 'defaultSorting' | 'card' | 'quickFilter'
      > & {
        grid: GridView<S>;
      };

  type GridView<S extends SchemaAttributes = SchemaAttributes> =
    | {
        columns: ViewColumn<S>[];
      }
    | ViewColumn<S>[];

  type ViewColumn<S extends SchemaAttributes = SchemaAttributes> =
    | $ViewColumn<S>
    | keyof S;

  export function resolveExperience<
    S extends SchemaAttributes = SchemaAttributes
  >(v: Experience<S>): $ViewExperience<S> {
    return {
      ...v,
      grid: resolveGridView(v.grid),
    };
  }

  function resolveGridView<S extends SchemaAttributes = SchemaAttributes>(
    v: GridView<S>
  ): $GridView<S> {
    if (Array.isArray(v)) {
      return {
        columns: v.map(resolveViewColumn),
      };
    }

    return {
      columns: v.columns.map(resolveViewColumn),
    };
  }

  function resolveViewColumn<S extends SchemaAttributes = SchemaAttributes>(
    v: ViewColumn<S>
  ): $ViewColumn<S> {
    if (typeof v === 'string') {
      return {
        name: v,
      };
    } else {
      return v as $ViewColumn<S>;
    }
  }
}

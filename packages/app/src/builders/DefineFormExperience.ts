import type {
  FormExperience as $FormExperience,
  Section as $Section,
} from '@headless-adminapp/core/experience/form';
import type { SectionControl as $SectionControl } from '@headless-adminapp/core/experience/form/SectionControl';
import type {
  Tab as $Tab,
  TabColumn as $TabColumn,
} from '@headless-adminapp/core/experience/form/Tab';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';

export namespace DefineFormExperience {
  export type Experience<S extends SchemaAttributes = SchemaAttributes> =
    | (Pick<
        $FormExperience<S>,
        | 'useHookFn'
        | 'relatedItems'
        | 'processFlow'
        | 'cloneAttributes'
        | 'defaultValues'
        | 'includeAttributes'
        | 'headerControls'
      > & {
        tabs: Tab<S>[];
      })
    | SectionControl<S>[];

  export function resolveExperience<
    S extends SchemaAttributes = SchemaAttributes
  >(v: Experience<S>): $FormExperience<S> {
    if (Array.isArray(v)) {
      return {
        tabs: [
          {
            label: 'General',
            name: 'general',
            columnCount: 2,
            tabColumns: [
              {
                sections: [
                  {
                    label: 'General',
                    name: 'general',
                    hideLabel: true,
                    controls: v.map(resolveSectionControl),
                  },
                ],
              },
            ],
          },
        ],
      };
    } else {
      return {
        ...v,
        tabs: v.tabs.map(resolveTab),
      };
    }
  }

  type Tab<S extends SchemaAttributes = SchemaAttributes> =
    | Pick<$Tab<S>, 'label' | 'localizedLabels' | 'name'> & {
        columnCount?: $Tab<S>['columnCount'];
        columnWidths?: $Tab<S>['columnWidths'];
      } & (
          | {
              tabColumns: TabColumn<S>[];
            }
          | {
              sections: Section<S>[];
            }
          | {
              controls: SectionControl<S>[];
            }
        );

  function resolveTab<S extends SchemaAttributes = SchemaAttributes>(
    v: Tab<S>
  ): $Tab<S> {
    const tab = {
      label: v.label,
      name: v.name,
      localizedLabels: v.localizedLabels,
    } as $Tab<S>;

    tab.columnCount = v.columnCount ?? 2;
    tab.columnWidths = v.columnWidths;
    if ('tabColumns' in v) {
      tab.tabColumns = v.tabColumns.map(resolveTabColumn);
    } else if ('sections' in v) {
      tab.tabColumns = [
        {
          sections: v.sections.map(resolveSection),
        },
      ];
    } else if ('controls' in v) {
      tab.tabColumns = [
        {
          sections: [
            {
              label: 'General',
              name: 'general',
              hideLabel: true,
              controls: v.controls.map(resolveSectionControl),
            },
          ],
        },
      ];
    } else {
      throw new Error('Invalid tab');
    }

    return tab;
  }

  type TabColumn<S extends SchemaAttributes = SchemaAttributes> = {
    sections: Section<S>[];
  };

  function resolveTabColumn<S extends SchemaAttributes = SchemaAttributes>(
    v: TabColumn<S>
  ): $TabColumn<S> {
    return {
      sections: v.sections.map(resolveSection),
    } as $TabColumn<S>;
  }

  type Section<S extends SchemaAttributes = SchemaAttributes> =
    | Pick<
        $Section<S>,
        | 'label'
        | 'columnCount'
        | 'labelPosition'
        | 'name'
        | 'localizedLabels'
        | 'hidden'
        | 'hideLabel'
        | 'noPadding'
      > & {
        controls: SectionControl<S>[];
      };

  function resolveSection<S extends SchemaAttributes = SchemaAttributes>(
    v: Section<S>
  ): $Section<S> {
    return {
      ...v,
      controls: v.controls.map(resolveSectionControl),
    };
  }

  export type SectionControl<S extends SchemaAttributes = SchemaAttributes> =
    | $SectionControl<S>
    | keyof S;

  function resolveSectionControl<S extends SchemaAttributes = SchemaAttributes>(
    v: DefineFormExperience.SectionControl<S>
  ): $SectionControl<S> {
    if (typeof v === 'string') {
      return {
        type: 'standard',
        attributeName: v,
      };
    } else {
      return v as $SectionControl<S>;
    }
  }
}

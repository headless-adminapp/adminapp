import {
  AsyncForm,
  AsyncQuickCreateForm,
  Form,
  FormExperience,
  QuickCreateForm,
} from '@headless-adminapp/core/experience/form';
import { SchemaExperience } from '@headless-adminapp/core/experience/schema';
import {
  AsyncView,
  View,
  ViewExperience,
} from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { Localized } from '@headless-adminapp/core/types';

import { DefineFormExperience } from './DefineFormExperience';
import { DefineViewExperience } from './DefineViewExperience';

abstract class BaseSchemaExperienceBuilder<S extends SchemaAttributes> {
  protected views: View<S>[] = [];
  protected forms: Form<S>[] = [];
  protected lookups: View<S>[] = [];
  protected quickCreateForms: QuickCreateForm<S>[] = [];

  protected defaultViewId: string | null = null;
  protected defaultFormId: string | null = null;
  protected defaultLookupId: string | null = null;
  protected defaultQuickCreateFormId: string | null = null;
  protected locked: boolean = false;

  constructor(protected readonly logicalName: string) {}

  public reset() {
    this.views = [];
    this.forms = [];
    this.lookups = [];
    this.quickCreateForms = [];
    this.defaultViewId = null;
    this.defaultFormId = null;
    this.defaultLookupId = null;
    this.defaultQuickCreateFormId = null;
    this.locked = false;
    return this;
  }

  protected baseBuild() {
    if (!this.defaultViewId) {
      throw new Error('Default view is required');
    }

    if (!this.defaultFormId) {
      throw new Error('Default form is required');
    }

    if (!this.defaultLookupId) {
      throw new Error('Default lookup is required');
    }

    if (!this.views.find((v) => v.id === this.defaultViewId)) {
      throw new Error('Default view not found');
    }

    if (!this.forms.find((f) => f.id === this.defaultFormId)) {
      throw new Error('Default form not found');
    }

    if (!this.lookups.find((l) => l.id === this.defaultLookupId)) {
      throw new Error('Default lookup not found');
    }

    if (
      this.defaultQuickCreateFormId &&
      !this.quickCreateForms.find((f) => f.id === this.defaultQuickCreateFormId)
    ) {
      throw new Error('Default quick create form not found');
    }

    return {
      logicalName: this.logicalName,
      defaultFormId: this.defaultFormId,
      defaultViewId: this.defaultViewId,
      views: this.views,
      forms: this.forms,
      defaultLookupId: this.defaultLookupId,
      lookups: this.lookups,
      defaultQuickCreateFormId: this.defaultQuickCreateFormId,
      quickCreateForms: this.quickCreateForms,
    };
  }
}

export interface SchemaExperienceBuilderDefaults {
  localizedViewNames?: Record<string, string>; // `All {label}` // key is locale
}

interface SchemaExperienceBuilderOptions {
  // localization: {
  //   defaultViewName: Record<string, (pluralName: string) => string>; // key is locale
  // };
}

export class SchemaExperienceBuilder<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSchemaExperienceBuilder<S> {
  constructor(
    private readonly schema: Schema<S>,
    private readonly defaults?: SchemaExperienceBuilderDefaults,
    private readonly options?: SchemaExperienceBuilderOptions
  ) {
    super(schema.logicalName);
  }

  public defineViewExperience(
    viewExperience: Pick<
      DefineViewExperience.Experience<S>,
      'filter' | 'defaultSorting'
    > & {
      grid?: DefineViewExperience.Experience<S>['grid'];
      card?: DefineViewExperience.Experience<S>['card'];
    }
  ): ViewExperience<S> {
    const cardView = viewExperience.card ?? this.defineDefaultViewCard();
    const gridView = viewExperience.grid ?? this.defineDefaultViewGrid();

    return DefineViewExperience.resolveExperience({
      ...viewExperience,
      grid: gridView,
      card: cardView,
    });
  }

  public defineFormExperience(
    formExperience: DefineFormExperience.Experience<S>
  ): FormExperience<S> {
    return DefineFormExperience.resolveExperience(formExperience);
  }

  public defineDefaultViewGrid(): ViewExperience<S>['grid'] {
    const columns = [] as ViewExperience<S>['grid']['columns'];

    columns.push({
      name: this.schema.primaryAttribute,
    });

    if (this.schema.createdAtAttribute) {
      columns.push({
        name: this.schema.createdAtAttribute,
      });
    }

    if (this.schema.updatedAtAttribute) {
      columns.push({
        name: this.schema.updatedAtAttribute,
      });
    }

    return {
      columns,
    };
  }

  public defineDefaultViewCard(): ViewExperience<S>['card'] {
    return {
      primaryColumn: this.schema.primaryAttribute,
    };
  }

  public defineDefaultViewExperience(): ViewExperience<S> {
    let defaultSorting: ViewExperience<S>['defaultSorting'] = undefined;

    if (this.schema.updatedAtAttribute) {
      defaultSorting = [
        {
          field: this.schema.updatedAtAttribute,
          order: 'desc',
        },
      ];
    } else if (this.schema.createdAtAttribute) {
      defaultSorting = [
        {
          field: this.schema.createdAtAttribute,
          order: 'desc',
        },
      ];
    }

    return {
      defaultSorting: defaultSorting,
      grid: this.defineDefaultViewGrid(),
      card: this.defineDefaultViewCard(),
    };
  }

  public defineDefaultFormExperience(): FormExperience<S> {
    return {
      headerControls: [],
      tabs: [
        {
          name: 'general',
          label: 'General',
          columnCount: 2,
          tabColumns: [
            {
              sections: [
                {
                  name: 'general',
                  label: 'General',
                  hideLabel: true,
                  controls: [
                    {
                      type: 'standard',
                      attributeName: this.schema.primaryAttribute,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  private getLocalizedViewNames(): Localized<string> {
    const langugesSet = new Set<string>();

    this.schema.localizedPluralLabels &&
      Object.keys(this.schema.localizedPluralLabels).forEach((key) =>
        langugesSet.add(key)
      );

    this.defaults?.localizedViewNames &&
      Object.keys(this.defaults.localizedViewNames).forEach((key) =>
        langugesSet.add(key)
      );

    const localizedLabels = Array.from(langugesSet).reduce((acc, key) => {
      const localizedPluralName =
        this.schema.localizedPluralLabels?.[key]?.toLowerCase() ??
        this.schema.pluralLabel.toLowerCase();
      const localizedPlaceholder =
        this.defaults?.localizedViewNames?.[key] ?? `All {label}`;

      const localeName = localizedPlaceholder.replace(
        '{label}',
        localizedPluralName
      );

      acc[key] = localeName;
      return acc;
    }, {} as Record<string, string>);

    return localizedLabels;
  }

  private resolveDefaultId<T extends { id: string }>(
    data: T[],
    defaultId: string | undefined | null
  ): string {
    if (data.length === 0) {
      throw new Error('No items found');
    }

    if (!defaultId) {
      return data[0].id;
    }

    if (!data.find((x) => x.id === defaultId)) {
      return data[0].id;
    }

    return defaultId;
  }

  public defineExperience(
    experience: Omit<
      SchemaExperience<S>,
      | 'logicalName'
      | 'forms'
      | 'views'
      | 'lookups'
      | 'defaultViewId'
      | 'defaultFormId'
      | 'defaultLookupId'
      | 'defaultAssociatedViewId'
      | 'quickCreateForms'
      | 'viewCommands'
      | 'subgridCommands'
      | 'formCommands'
      | 'associatedViews'
    > & {
      forms?: Omit<AsyncForm<S>, 'logicalName'>[];
      views?: Omit<AsyncView<S>, 'logicalName'>[];
      lookups?: Omit<AsyncView<S>, 'logicalName'>[];
      associatedViews?: Omit<AsyncView<S>, 'logicalName'>[];
      quickCreateForms?: Omit<AsyncQuickCreateForm<S>, 'logicalName'>[];
      defaultViewId?: string;
      defaultFormId?: string;
      defaultLookupId?: string;
      defaultAssociatedViewId?: string;
      viewCommands?: SchemaExperience<S>['viewCommands'];
      subgridCommands?: SchemaExperience<S>['subgridCommands'];
      formCommands?: SchemaExperience<S>['formCommands'];
    }
  ): SchemaExperience<S> {
    let lookups = experience.lookups;
    let views = experience.views;
    let forms = experience.forms;
    let associatedViews = experience.associatedViews;

    if (!lookups?.length) {
      lookups = [
        {
          id: 'default',
          name: 'Default',
          experience: this.defineViewExperience({}),
        },
      ];
    }

    if (!views?.length) {
      views = [
        {
          id: 'default',
          name: `All ${this.schema.pluralLabel.toLowerCase()}`,
          experience: this.defineDefaultViewExperience(),
          localizedNames: this.getLocalizedViewNames(),
        },
      ];
    }

    if (!associatedViews?.length) {
      associatedViews = [
        {
          id: 'default',
          name: `All ${this.schema.pluralLabel.toLowerCase()}`,
          experience: this.defineDefaultViewExperience(),
          localizedNames: this.getLocalizedViewNames(),
        },
      ];
    }

    if (!forms?.length) {
      forms = [
        {
          id: 'default',
          name: 'Default',
          experience: this.defineDefaultFormExperience(),
        },
      ];
    }

    const defaultViewId = this.resolveDefaultId(
      views,
      experience.defaultViewId
    );
    const defaultFormId = this.resolveDefaultId(
      forms,
      experience.defaultFormId
    );
    const defaultLookupId = this.resolveDefaultId(
      lookups,
      experience.defaultLookupId
    );
    const defaultAssociatedViewId = this.resolveDefaultId(
      associatedViews,
      experience.defaultAssociatedViewId
    );

    let defaultQuickCreateFormId = null;

    if (experience.quickCreateForms?.length) {
      defaultQuickCreateFormId = this.resolveDefaultId(
        experience.quickCreateForms ?? [],
        experience.defaultQuickCreateFormId
      );
    }

    return {
      logicalName: this.logicalName,
      Icon: experience.Icon,
      defaultQuickCreateFormId: defaultQuickCreateFormId,
      defaultFormId,
      defaultViewId,
      defaultLookupId,
      defaultAssociatedViewId,
      quickCreateForms:
        experience.quickCreateForms?.map((x) => ({
          ...x,
          logicalName: this.logicalName,
        })) ?? [],
      views:
        views.map((x) => ({
          ...x,
          logicalName: this.logicalName,
        })) ?? [],
      forms:
        forms.map((x) => ({
          ...x,
          logicalName: this.logicalName,
        })) ?? [],
      lookups:
        lookups.map((x) => ({
          ...x,
          logicalName: this.logicalName,
        })) ?? [],
      associatedViews:
        associatedViews.map((x) => ({
          ...x,
          logicalName: this.logicalName,
        })) ?? [],
      formCommands: experience.formCommands,
      subgridCommands: experience.subgridCommands,
      viewCommands: experience.viewCommands,
    };
  }
}

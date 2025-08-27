import { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import {
  EntityMainFormCommandItemExperience,
  Form,
  QuickCreateForm,
} from '@headless-adminapp/core/experience/form';
import {
  SchemaExperience,
  SchemaExperienceMetadata,
} from '@headless-adminapp/core/experience/schema';
import {
  CardView,
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
  View,
} from '@headless-adminapp/core/experience/view';
import {
  Schema,
  SchemaAttributes,
  SchemaMetadata,
} from '@headless-adminapp/core/schema';
import {
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';
import { stringWithDefault } from '@headless-adminapp/core/utils';

export function getDefaultCardView<
  S extends SchemaAttributes = SchemaAttributes
>(schema: Schema<S>): CardView<S> {
  return {
    primaryColumn: schema.primaryAttribute,
  };
}

interface SchemaExperienceStoreOptions {
  schemaStore: ISchemaStore;
}

export class SchemaExperienceStore implements ISchemaExperienceStore {
  private experiences: Record<string, SchemaExperience> = {};

  public constructor(protected options: SchemaExperienceStoreOptions) {}

  register<S extends SchemaAttributes = SchemaAttributes>(
    experience: SchemaExperience<S>
  ): void {
    for (const view of Object.values(experience.views)) {
      if (!view.id) {
        throw new Error('View id is required');
      }

      if (!view.name) {
        throw new Error('View name is required');
      }

      if (view.logicalName !== experience.logicalName) {
        throw new Error('View logicalName must match experience logicalName');
      }
    }
    this.experiences[experience.logicalName] = experience as SchemaExperience;
  }

  public async getExperience<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string
  ): Promise<SchemaExperience<S>> {
    const experience = this.experiences[logicalName];

    if (!experience) {
      throw new Error(`Experience for ${logicalName} not found`);
    }

    return experience;
  }

  public async getPublicViewLookup(
    logicalName: string,
    viewIds?: string[]
  ): Promise<LocalizedDataLookup[]> {
    const experience = await this.getExperience(logicalName);

    let views = experience.views;

    if (viewIds?.length) {
      views = views.filter((view) => viewIds.includes(view.id));
    }

    if (!views.length) {
      views = experience.views.filter((x) => x.id === experience.defaultViewId);
    }

    return views.map((view) => ({
      id: view.id,
      name: view.name,
      localizedNames: view.localizedNames,
    }));
  }

  public async getAssociatedViewLookup(
    logicalName: string,
    viewIds?: string[]
  ): Promise<LocalizedDataLookup[]> {
    const experience = await this.getExperience(logicalName);

    let associatedViews = experience.associatedViews;

    if (viewIds?.length) {
      associatedViews = associatedViews.filter((view) =>
        viewIds.includes(view.id)
      );
    }

    if (!associatedViews.length) {
      associatedViews = experience.associatedViews.filter(
        (x) => x.id === experience.defaultAssociatedViewId
      );
    }

    return associatedViews.map((view) => ({
      id: view.id,
      name: view.name,
      localizedNames: view.localizedNames,
    }));
  }

  async getPublicView<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string,
    viewIds?: string[]
  ): Promise<View<S>> {
    const experience = await this.getExperience(logicalName);

    const availableViewLookup = await this.getPublicViewLookup(
      logicalName,
      viewIds
    );

    let validViewIds = availableViewLookup.map((x) => x.id);

    if (!validViewIds.length) {
      validViewIds = [experience.defaultViewId];
    }

    viewId = stringWithDefault(viewId, experience.defaultViewId);

    if (!validViewIds.includes(viewId)) {
      viewId = validViewIds[0];
    }

    let view = experience.views.find((v) => v.id === viewId);

    if (!view) {
      throw new Error(`View ${viewId} not found`);
    }

    let viewExperience = view.experience;

    if (typeof viewExperience === 'function') {
      viewExperience = await viewExperience();
    }

    if (!viewExperience.card) {
      viewExperience.card = getDefaultCardView(
        this.options.schemaStore.getSchema(logicalName)
      );
    }

    return {
      id: view.id,
      name: view.name,
      logicalName: view.logicalName,
      localizedNames: view.localizedNames,
      experience: viewExperience,
    };
  }

  async getAssociatedView<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string,
    viewIds?: string[]
  ): Promise<View<S>> {
    const experience = await this.getExperience(logicalName);

    const availableViewLookup = await this.getAssociatedViewLookup(
      logicalName,
      viewIds
    );

    let validViewIds = availableViewLookup.map((x) => x.id);

    if (!validViewIds.length) {
      validViewIds = [experience.defaultViewId];
    }

    viewId = stringWithDefault(viewId, experience.defaultAssociatedViewId);

    if (!validViewIds.includes(viewId)) {
      viewId = validViewIds[0];
    }

    let view = experience.associatedViews.find((v) => v.id === viewId);

    if (!view) {
      throw new Error(`View ${viewId} not found`);
    }

    let viewExperience = view.experience;

    if (typeof viewExperience === 'function') {
      viewExperience = await viewExperience();
    }

    if (!viewExperience.card) {
      viewExperience.card = getDefaultCardView(
        this.options.schemaStore.getSchema(logicalName)
      );
    }

    return {
      id: view.id,
      name: view.name,
      logicalName: view.logicalName,
      localizedNames: view.localizedNames,
      experience: viewExperience,
    };
  }

  async getViewLookupV2<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string
  ): Promise<View<S>> {
    const experience = await this.getExperience(logicalName);

    viewId = stringWithDefault(viewId, experience.defaultLookupId);

    const view = experience.lookups.find((v) => v.id === viewId);

    if (!view) {
      throw new Error(`Lookup ${viewId} not found`);
    }

    let viewExperience = view.experience;

    if (typeof viewExperience === 'function') {
      viewExperience = await viewExperience();
    }

    return {
      id: view.id,
      name: view.name,
      logicalName: view.logicalName,
      experience: viewExperience,
    };
  }

  async getDefaultViewId(logicalName: string): Promise<string> {
    const experience = await this.getExperience(logicalName);

    return experience.defaultViewId;
  }

  async getDefaultViewLookupId(logicalName: string): Promise<string> {
    const experience = await this.getExperience(logicalName);

    return experience.defaultLookupId;
  }

  async getDefaultFormId(logicalName: string): Promise<string> {
    const experience = await this.getExperience(logicalName);

    return experience.defaultFormId;
  }

  async getDefaultQuickCreateFormId(
    logicalName: string
  ): Promise<string | null> {
    const experience = await this.getExperience(logicalName);

    return experience.defaultQuickCreateFormId ?? null;
  }

  async getIsQuickCreateSupported(logicalName: string): Promise<boolean> {
    const experience = await this.getExperience(logicalName);

    return (
      !!experience.defaultQuickCreateFormId &&
      experience.quickCreateForms.length > 0
    );
  }

  async getForm<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    formId?: string
  ): Promise<Form<S>> {
    const experience = await this.getExperience(logicalName);

    if (!formId) {
      formId = experience.defaultFormId;
    }

    const form = experience.forms.find((f) => f.id === formId);

    if (!form) {
      throw new Error(`Form ${formId} not found`);
    }

    let formExperience = form.experience;

    if (typeof formExperience === 'function') {
      formExperience = await formExperience();
    }

    return {
      id: form.id,
      name: form.name,
      logicalName: form.logicalName,
      experience: formExperience,
    };
  }

  async getQuickCreateForm<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    formId?: string
  ): Promise<QuickCreateForm<S>> {
    const experience = await this.getExperience(logicalName);

    if (!formId) {
      if (!experience.defaultQuickCreateFormId) {
        throw new Error(
          `No quick create form ID provided and no default quick create form ID found for ${logicalName}`
        );
      }

      formId = experience.defaultQuickCreateFormId;
    }

    const form = experience.quickCreateForms.find((f) => f.id === formId);

    if (!form) {
      throw new Error(`Quick create form ${formId} not found`);
    }

    let formExperience = form.experience;

    if (typeof formExperience === 'function') {
      formExperience = await formExperience();
    }

    return {
      id: form.id,
      name: form.name,
      logicalName: form.logicalName,
      experience: formExperience,
    };
  }

  async getViewCommands(
    logicalName: string
  ): Promise<EntityMainGridCommandItemExperience[][] | undefined> {
    const experience = await this.getExperience(logicalName);

    return experience.viewCommands;
  }

  async getFormCommands(
    logicalName: string
  ): Promise<EntityMainFormCommandItemExperience[][] | undefined> {
    const experience = await this.getExperience(logicalName);

    return experience.formCommands;
  }

  async getSubgridCommands(
    logicalName: string
  ): Promise<SubGridCommandItemExperience[][] | undefined> {
    const experience = await this.getExperience(logicalName);

    return experience.subgridCommands;
  }

  getSchemaMetadataList(): SchemaMetadata[] {
    const schemas = this.options.schemaStore.getAllSchema();
    return Object.values(schemas).map((schema) => ({
      logicalName: schema.logicalName,
      label: schema.label,
      pluralLabel: schema.pluralLabel,
      description: schema.description,
      localizedDescriptions: schema.localizedDescriptions,
      localizedLabels: schema.localizedLabels,
      localizedPluralLabels: schema.localizedPluralLabels,
    }));
  }

  async getExperienceSchemaMetadatList(): Promise<SchemaExperienceMetadata[]> {
    const schemaMetadatas = this.getSchemaMetadataList();

    return schemaMetadatas.map((schemaMetadata) => ({
      ...schemaMetadata,
      Icon: this.experiences[schemaMetadata.logicalName]?.Icon,
    }));
  }
}

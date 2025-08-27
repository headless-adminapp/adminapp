import { LocalizedDataLookup } from '../attributes/DataLookup';
import { Form, QuickCreateForm } from '../experience/form';
import { EntityMainFormCommandItemExperience } from '../experience/form/command';
import {
  SchemaExperience,
  SchemaExperienceMetadata,
} from '../experience/schema';
import { View } from '../experience/view';
import {
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
} from '../experience/view/command';
import { SchemaAttributes } from '../schema';

export interface ISchemaExperienceStore {
  getExperience<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string
  ): Promise<SchemaExperience<S>>;

  getPublicViewLookup(
    logicalName: string,
    viewIds?: string[]
  ): Promise<LocalizedDataLookup[]>;
  getAssociatedViewLookup(
    logicalName: string,
    viewIds?: string[]
  ): Promise<LocalizedDataLookup[]>;

  getPublicView<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string,
    viewIds?: string[]
  ): Promise<View<S>>;

  getAssociatedView<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string,
    viewIds?: string[]
  ): Promise<View<S>>;

  getViewLookupV2<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    viewId?: string,
    viewIds?: string[]
  ): Promise<View<S>>;

  getDefaultViewId(logicalName: string): Promise<string>;

  getDefaultViewLookupId(logicalName: string): Promise<string>;

  getDefaultFormId(logicalName: string): Promise<string>;

  getDefaultQuickCreateFormId(logicalName: string): Promise<string | null>;

  getIsQuickCreateSupported(logicalName: string): Promise<boolean>;

  getForm<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    formId?: string
  ): Promise<Form<S>>;

  getQuickCreateForm<S extends SchemaAttributes = SchemaAttributes>(
    logicalName: string,
    formId?: string
  ): Promise<QuickCreateForm<S>>;

  getViewCommands(
    logicalName: string
  ): Promise<EntityMainGridCommandItemExperience[][] | undefined>;

  getFormCommands(
    logicalName: string
  ): Promise<EntityMainFormCommandItemExperience[][] | undefined>;

  getSubgridCommands(
    logicalName: string
  ): Promise<SubGridCommandItemExperience[][] | undefined>;

  getExperienceSchemaMetadatList(): Promise<SchemaExperienceMetadata[]>;
}

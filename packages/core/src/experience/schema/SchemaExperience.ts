import { Icon } from '@headless-adminapp/icons';

import { SchemaAttributes } from '../../schema';
import { AsyncForm, AsyncQuickCreateForm } from '../form';
import { EntityMainFormCommandItemExperience } from '../form/command';
import { AsyncView } from '../view';
import {
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
} from '../view/command';

export type SchemaExperience<S extends SchemaAttributes = SchemaAttributes> = {
  logicalName: string;
  Icon?: Icon;

  // forms
  forms: AsyncForm<S>[];
  quickCreateForms: AsyncQuickCreateForm<S>[];

  views: AsyncView<S>[];
  associatedViews: AsyncView<S>[];
  lookups: AsyncView<S>[];

  // default ids
  defaultQuickCreateFormId?: string | null;
  defaultViewId: string;
  defaultFormId: string;
  defaultLookupId: string;
  defaultAssociatedViewId: string;

  // commands
  viewCommands?: EntityMainGridCommandItemExperience[][];
  subgridCommands?: SubGridCommandItemExperience[][];
  formCommands?: EntityMainFormCommandItemExperience[][];
};

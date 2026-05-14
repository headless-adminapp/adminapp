import type { Icon } from '@headless-adminapp/icons';

import type { SchemaAttributes } from '../../schema';
import type { AsyncForm, AsyncQuickCreateForm } from '../form';
import type { EntityMainFormCommandItemExperience } from '../form/command';
import type { AsyncView } from '../view';
import type {
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

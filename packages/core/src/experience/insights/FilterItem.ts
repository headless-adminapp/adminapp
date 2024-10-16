import { Icon } from '@headless-adminapp/icons';

import { SchemaAttributes } from '../../schema';

export interface FilterItem<S extends SchemaAttributes = SchemaAttributes> {
  logicalName: keyof S;
  Icon?: Icon;
  showInFilterBar?: boolean;
  allowQuickFilter?: boolean;
  quickFilterTitle?: string;
}

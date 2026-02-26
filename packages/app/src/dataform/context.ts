import {
  EntityMainFormCommandItemExperience,
  Form,
  Section,
} from '@headless-adminapp/core/experience/form';
import { SectionControl } from '@headless-adminapp/core/experience/form/SectionControl';
import { Tab } from '@headless-adminapp/core/experience/form/Tab';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { IEventManager } from '@headless-adminapp/core/store';
import { Data } from '@headless-adminapp/core/transport';
import { Localized, Nullable } from '@headless-adminapp/core/types';

import { createContext } from '../mutable';
import { SaveRecordFn } from './utils/saveRecord';

export interface RelatedItemInfo {
  key: string;
  logicalName: string;
  pluralLabel: string;
  localizedPluralLabels?: Localized<string>;
  attributeName: string;
}

export type DataFormContextState<
  SA extends SchemaAttributes = SchemaAttributes,
> = {
  contextKey: number; // used to check if props have changed and reset the context

  // from props
  schema: Schema<SA>;
  form: Form<SA>;
  recordId?: string | number;
  navigatorLogicalName?: string;
  navigatorRecordId?: string | number;
  cloneId?: string | number;
  commands: EntityMainFormCommandItemExperience[][];
  saveRecordFn: SaveRecordFn;

  // internal state (visual)
  // field visibilities
  // disabled fields
  activeTab: string;
  selectedRelatedItem: RelatedItemInfo | null;
  disabledControls: Record<string, boolean>;
  requiredFields: Record<string, boolean>;
  hiddenControls: Record<string, boolean>;
  hiddenSections: Record<string, boolean>;
  hiddenTabs: Record<string, boolean>;

  formInternal: {
    controls: {
      list: SectionControl<SA>[];
      dict: Record<string, SectionControl<SA>>;
    };
    sections: {
      list: Section<SA>[];
      dict: Record<string, Section<SA>>;
    };
    tabs: {
      dict: Record<string, Tab<SA>>;
    };
  };

  // internal state (data)
  record?: Data<InferredSchemaType<SA>>;
  cloneRecord?: Data<InferredSchemaType<SA>>;
  isReadonly?: boolean;
  eventManager: IEventManager;

  dataState: {
    isFetching: boolean;
    isError?: boolean;
  };

  refresh: () => Promise<void>;

  // form
  initialValues: Nullable<InferredSchemaType<SA>>;

  // other
  // config: FormConfig;
  // useCustomState?: () => unknown;
};

export const DataFormContext = createContext<DataFormContextState>();

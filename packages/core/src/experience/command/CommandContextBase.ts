import type { QueryClient } from '@tanstack/react-query';

import { InferredSchemaType, SchemaAttributes } from '../../schema';
import {
  IClientAppStore,
  ISchemaExperienceStore,
  ISchemaStore,
} from '../../store';
import { IDataService } from '../../transport';
import {
  ConfirmDialogOptions,
  ConfirmResult,
  PromptDialogOptions,
} from '../dialog';
import { Locale } from '../locale';

export interface OpenFormOptions {
  logicalName: string;
  id?: string;
  formId?: string;
  parameters?: Record<string, string>; // Used while creating a new record
  useQuickCreateForm?: boolean; // Used while creating a new record and create create form should available
  replace?: boolean; // Replace the current form
}

interface Navigation {
  openForm: (options: OpenFormOptions) => void;
}

interface Utiltity {
  showProgressIndicator: (message?: string) => void;
  hideProgressIndicator: () => void;
  openAlertDialog(options: {
    text: string;
    title?: string;
    confirmButtonLabel?: string;
  }): Promise<void>;
  openConfirmDialog(
    options: Omit<
      ConfirmDialogOptions,
      'type' | 'onConfirm' | 'onDismiss' | 'onCancel'
    >
  ): Promise<ConfirmResult | null>;
  openErrorDialog(options: {
    text: string;
    title?: string;
    confirmButtonLabel?: string;
  }): void;
  openPromptDialog: <SA extends SchemaAttributes = SchemaAttributes>(
    options: Omit<
      PromptDialogOptions<SA>,
      'type' | 'onConfirm' | 'onClose' | 'onCancel'
    >
  ) => Promise<InferredSchemaType<SA> | null>;
  showNotification: (options: {
    text: string;
    title?: string;
    actions?: { text: string; onClick: () => void }[];
    type?: 'info' | 'success' | 'warning' | 'error';
  }) => void;
}

interface Store {
  appStore: IClientAppStore;
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
}

export interface CommandContextBase {
  dataService: IDataService;
  navigation: Navigation;
  queryClient: Pick<QueryClient, 'clear'>;
  utility: Utiltity;
  stores: Store;
  locale: Locale;
}

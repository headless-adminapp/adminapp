import type { QueryClient } from '@tanstack/react-query';

import type { InferredSchemaType, SchemaAttributes } from '../../schema';
import type { ISchemaExperienceStore, ISchemaStore } from '../../store';
import type { IDataService } from '../../transport';
import { AuthSession } from '../auth';
import {
  ConfirmDialogOptions,
  ConfirmResult,
  PromptDialogOptions,
} from '../dialog';
import { Locale } from '../locale';

export interface OpenFormOptions {
  logicalName: string;
  id?: string | number | null;
  formId?: string;
  parameters?: Record<string, unknown>; // Used while creating a new record
  recordSetIds?: string[]; // Used to pass record set ids to the form
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
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
}

export interface CommandContextBase {
  dataService: IDataService;
  navigation: Navigation;
  queryClient: QueryClient;
  utility: Utiltity;
  stores: Store;
  locale: Locale;
  authSession: AuthSession | null;
}

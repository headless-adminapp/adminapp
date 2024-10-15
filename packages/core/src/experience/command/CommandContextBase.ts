import { QueryClient } from '@tanstack/react-query';

import { InferredSchemaType, SchemaAttributes } from '../../schema';
import {
  IClientAppStore,
  ISchemaExperienceStore,
  ISchemaStore,
} from '../../store';
import { IDataService } from '../../transport';
import { Locale } from '../app';
import {
  ConfirmDialogOptions,
  ConfirmResult,
  PromptDialogOptions,
} from '../dialog';

// interface Navigation {}

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
  // navigation: Navigation; // todo: add navigation
  queryClient: QueryClient;
  utility: Utiltity;
  stores: Store;
  locale: Locale;
}

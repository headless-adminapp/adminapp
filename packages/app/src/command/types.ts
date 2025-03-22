import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import {
  ConfirmDialogOptions,
  PromptDialogOptions,
} from '@headless-adminapp/core/experience/dialog';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import {
  ArrayGroupWithAtLeastOne,
  Localized,
} from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

interface ConfirmResult {
  confirmed: boolean;
}
export interface UtilityContextState {
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

interface BaseCommandState {
  Icon: Icon;
  iconPosition?: 'before' | 'after';
  danger?: boolean;
  hidden?: boolean;
  appearance?: 'subtle' | 'colored';
}

interface ActionableCommandState {
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

export interface IconButtonCommandState
  extends BaseCommandState,
    ActionableCommandState {
  type: 'icon';
  isQuickAction?: boolean;
}

export interface ButtonCommandState
  extends BaseCommandState,
    ActionableCommandState {
  type: 'button';
  text: string;
  isQuickAction?: boolean;
  isContextMenu?: boolean; // Keep visible for right click context menu
  localizedTexts?: Localized<string>;
}

export interface LabelCommandState extends BaseCommandState {
  type: 'label';
  text: string;
  localizedTexts?: Localized<string>;
}

export interface MenuItemCommandState
  extends BaseCommandState,
    ActionableCommandState {
  text: string;
  localizedTexts?: Localized<string>;
  items?: ArrayGroupWithAtLeastOne<MenuItemCommandState>;
}

export interface MenuComandState
  extends BaseCommandState,
    ActionableCommandState {
  type: 'menu';
  text: string;
  localizedTexts?: Localized<string>;
  isContextMenu?: boolean; // Keep visible for right click context menu
  items: ArrayGroupWithAtLeastOne<MenuItemCommandState>;
}

export type CommandItemState =
  | IconButtonCommandState
  | ButtonCommandState
  | MenuComandState
  | LabelCommandState;

export type Selector<T> = (value: T) => boolean;

export type CommandItemExperienceSelector<Context> = Selector<
  CommandItemExperience<Context>
>;

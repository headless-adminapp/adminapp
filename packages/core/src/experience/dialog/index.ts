import { Nullable } from '@headless-adminapp/core/types';

import { InferredSchemaType, SchemaAttributes } from '../../schema';

export interface BasicDialogProps {
  id: string;
  isOpen: boolean;
}

export interface AlertDialogOptions {
  type: 'alert';
  title?: string;
  text: string;
  allowDismiss?: boolean;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export interface ConfirmResult {
  confirmed: boolean;
}

export interface ConfirmDialogOptions {
  type: 'confirm';
  title?: string;
  text: string;
  allowDismiss?: boolean;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export interface ErrorDialogOptions {
  type: 'error';
  title?: string;
  text: string;
  allowDismiss?: boolean;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export interface PromptDialogOptions<
  SA extends SchemaAttributes = SchemaAttributes
> {
  type: 'prompt';
  title?: string;
  text?: string;
  attributes: SA;
  defaultValues: Partial<Nullable<InferredSchemaType<SA>>>;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  allowDismiss?: boolean;
  onConfirm?: (values: InferredSchemaType<SA>) => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export interface CustomDialogOptions<P extends any = any> {
  type: 'custom';
  Component: React.ComponentType<P & BasicDialogProps>;
  props: P;
}

export type DialogOptions =
  | AlertDialogOptions
  | ConfirmDialogOptions
  | ErrorDialogOptions
  | PromptDialogOptions
  | CustomDialogOptions;

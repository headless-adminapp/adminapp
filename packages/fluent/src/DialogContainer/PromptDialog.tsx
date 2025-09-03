import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  tokens,
} from '@fluentui/react-components';
import { attributesFormValidator } from '@headless-adminapp/app/dataform/utils';
import { useFormValidationStrings } from '@headless-adminapp/app/form';
import { useLocale } from '@headless-adminapp/app/locale';
import { PromptDialogOptions } from '@headless-adminapp/core/experience/dialog';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { Controller, useForm } from 'react-hook-form';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { StandardControl } from '../PageEntityForm/StandardControl';

interface PromptDialogProps<SA extends SchemaAttributes = SchemaAttributes> {
  open: boolean;
  title?: PromptDialogOptions<SA>['title'];
  text?: PromptDialogOptions<SA>['text'];
  cancelText?: PromptDialogOptions<SA>['cancelButtonLabel'];
  attributes: PromptDialogOptions<SA>['attributes'];
  defaultValues: PromptDialogOptions<SA>['defaultValues'];
  confirmText?: PromptDialogOptions<SA>['confirmButtonLabel'];
  onConfirm?: PromptDialogOptions<SA>['onConfirm'];
  onCancel?: PromptDialogOptions<SA>['onCancel'];
  onDismiss?: PromptDialogOptions<SA>['onDismiss'];
}

export function PromptDialog(props: Readonly<PromptDialogProps>) {
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const form = useForm({
    mode: 'all',
    defaultValues: props.defaultValues,
    shouldUnregister: false,
    resolver: attributesFormValidator({
      attributes: props.attributes,
      language,
      strings: formValidationStrings,
      region,
    }),
  });

  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.onDismiss?.();
      }}
    >
      <DialogSurface style={{ maxWidth: 480 }}>
        <DialogBody>
          {!!props.title && <DialogTitle>{props.title}</DialogTitle>}
          <DialogContent>
            {!!props.text && <Body1>{props.text}</Body1>}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacingVerticalM,
                marginTop: tokens.spacingVerticalL,
                marginBottom: tokens.spacingVerticalL,
              }}
            >
              {Object.entries(props.attributes).map(
                ([attributeName, attribute]) => {
                  return (
                    <Controller
                      key={attributeName}
                      control={form.control}
                      name={attributeName}
                      render={({ field, fieldState, formState }) => {
                        const isError =
                          (fieldState.isTouched || formState.isSubmitted) &&
                          !!fieldState.error?.message;
                        const errorMessage =
                          fieldState.isTouched || formState.isSubmitted
                            ? fieldState.error?.message
                            : '';

                        return (
                          <SectionControlWrapper
                            label={attribute.label}
                            labelPosition="left"
                            required={attribute.required}
                            isError={isError}
                            errorMessage={errorMessage}
                          >
                            <StandardControl
                              attribute={attribute}
                              name={attributeName}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              errorMessage={errorMessage}
                              isError={isError}
                              readOnly={attribute.readonly}
                            />
                          </SectionControlWrapper>
                        );
                      }}
                    />
                  );
                }
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              type="button"
              onClick={() => {
                props.onCancel?.();
              }}
            >
              {props.cancelText ?? 'Cancel'}
            </Button>
            <Button
              appearance="primary"
              disabled={
                form.formState.submitCount > 0 && !form.formState.isValid
              }
              onClick={async () => {
                await form.handleSubmit(async (values) => {
                  props.onConfirm?.(values);
                })();
              }}
            >
              {props.confirmText ?? 'Confirm'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

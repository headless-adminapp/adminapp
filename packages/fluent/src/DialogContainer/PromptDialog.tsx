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
import { generateAttributeValidationSchema } from '@headless-adminapp/app/dataform/utils';
import {
  FormValidationStringSet,
  useFormValidationStrings,
} from '@headless-adminapp/app/form';
import { useLocale } from '@headless-adminapp/app/locale';
import { PromptDialogOptions } from '@headless-adminapp/core/experience/dialog';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { memoize } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

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

export function PromptDialog(props: PromptDialogProps) {
  const { language } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const form = useForm({
    mode: 'all',
    defaultValues: props.defaultValues,
    shouldUnregister: false,
    resolver: formValidator(props.attributes, language, formValidationStrings),
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
                      key={attributeName as string}
                      control={form.control}
                      name={attributeName as string}
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
                              name={attributeName as string}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              errorMessage={errorMessage}
                              isError={isError}
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

export const formValidator = memoize(
  function formValidator<A extends SchemaAttributes = SchemaAttributes>(
    attributes: A,
    language: string,
    strings: FormValidationStringSet
  ) {
    return async (values: Record<string, any>, context: any, options: any) => {
      const validator = generateValidationSchema(attributes, language, strings);

      const resolver = yupResolver(validator);

      const result = await resolver(values, context, options);

      return result;
    };
  },
  (attributes) => JSON.stringify({ attributes })
);

export const generateValidationSchema = memoize(
  function generateValidationSchema<
    A extends SchemaAttributes = SchemaAttributes
  >(attributes: A, language: string, strings: FormValidationStringSet) {
    const columns = Object.keys(attributes);
    return yup.object().shape({
      ...(columns.reduce((acc, column) => {
        const attribute = attributes[column];

        const validationSchema = generateAttributeValidationSchema(
          attribute,
          language,
          strings
        );

        return {
          ...acc,
          [column]: validationSchema,
        };
      }, {} as Record<string, yup.Schema<any>>) as any),
    });
  },
  (attributes) => JSON.stringify({ attributes })
);

import {
  Button,
  DialogActions,
  DialogBody,
  DialogTitle,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import {
  BaseEventAttributes,
  baseEventAttributes,
} from '@headless-adminapp/app/calendar/baseEventAttributes';
import { CalendarConfig } from '@headless-adminapp/app/calendar/types';
import { getModifiedValues } from '@headless-adminapp/app/dataform/utils/saveRecord';
import { useFormValidationStrings } from '@headless-adminapp/app/form';
import { useLocale } from '@headless-adminapp/app/locale';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Nullable } from '@headless-adminapp/core/types';
import { iconSet } from '@headless-adminapp/icons-fluent';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { BodyLoading } from '../../components/BodyLoading';
import { EventFormContent } from './EventFormContent';
import { BaseFieldValues } from './types';
import { formValidator } from './utils';

interface EventFormBodyProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> {
  values: Partial<
    Nullable<
      InferredSchemaType<BaseEventAttributes> &
        InferredSchemaType<SA1> &
        InferredSchemaType<SA2>
    >
  >;
  onSubmit?: (data: {
    modifiedValues: Partial<Nullable<InferredSchemaType<BaseEventAttributes>>>;
    values: Nullable<InferredSchemaType<BaseEventAttributes>>;
  }) => Promise<void>;
  onCancel?: () => void;
  allowOpenRecord?: boolean;
  onOpenRecord?: (id: string) => void;
  onDelete?: (id: string) => void;
  config: CalendarConfig;
}

export function EventFormBody(props: Readonly<EventFormBodyProps>) {
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const { data: record, isPending } = useQuery({
    queryKey: ['calendar-events', 'event', props.values.id],
    queryFn: async () => {
      if (props.values.id && props.config.eventResolver) {
        return props.config.eventResolver(props.values.id);
      }

      return null;
    },
  });

  const form = useForm<BaseFieldValues>({
    mode: 'all',
    defaultValues: props.values as BaseFieldValues,
    shouldUnregister: false,
    resolver: formValidator({
      attributes: baseEventAttributes,
      language,
      strings: formValidationStrings,
      region,
    }),
  });

  const formRef = useRef(form);
  formRef.current = form;

  const defaultValues = useMemo(() => {
    return {
      ...props.values,
      ...record,
      id: props.values.id,
      title: props.values.title,
      description: props.values.description,
      start: props.values.start,
      end: props.values.end,
      allDay: props.values.allDay,
    } as BaseFieldValues;
  }, [record, props.values]);

  useEffect(() => {
    formRef.current.reset(defaultValues);
  }, [defaultValues]);

  return (
    <DialogBody>
      <DialogTitle
        action={
          props.values.id ? (
            <Menu positioning="below-end">
              <MenuTrigger>
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<iconSet.MoreVertical />}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {props.allowOpenRecord && (
                    <MenuItem
                      icon={<iconSet.OpenInNew size={20} />}
                      onClick={() =>
                        props.onOpenRecord?.(props.values.id as string)
                      }
                    >
                      Open
                    </MenuItem>
                  )}
                  <MenuItem
                    icon={<iconSet.Delete size={20} />}
                    onClick={() => props.onDelete?.(props.values.id as string)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          ) : null
        }
      >
        {props.values.id ? 'Edit' : 'New'}{' '}
        {props.config.eventLabel.toLowerCase()}
      </DialogTitle>
      <EventFormContent
        form={form}
        afterDescriptionAttributes={props.config.afterDescriptionAttributes}
        beforeDescriptionAttributes={props.config.beforeDescriptionAttributes}
      />
      <DialogActions>
        <Button
          appearance="primary"
          disabled={form.formState.submitCount > 0 && !form.formState.isValid}
          onClick={async () => {
            await form.handleSubmit(async (values) => {
              await props.onSubmit?.({
                modifiedValues: values.id
                  ? getModifiedValues(defaultValues, values)
                  : values,
                values,
              });
            })();
          }}
        >
          {props.values.id ? 'Save' : 'Create'}
        </Button>
        <Button
          appearance="secondary"
          type="button"
          onClick={() => {
            props.onCancel?.();
          }}
        >
          {props.values.id ? 'Close' : 'Cancel'}
        </Button>
      </DialogActions>
      <BodyLoading loading={isPending} />
    </DialogBody>
  );
}

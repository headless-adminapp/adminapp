import { Dialog } from '@fluentui/react-components';
import {
  BaseEventAttributes,
  baseEventAttributes,
} from '@headless-adminapp/app/calendar/baseEventAttributes';
import {
  CalendarConfig,
  CalendarEventResolverFn,
} from '@headless-adminapp/app/calendar/types';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { defineSchemaAttributes } from '@headless-adminapp/core/schema/utils';
import { Nullable } from '@headless-adminapp/core/types';

import { DialogSurface } from '../../components/fluent';
import { EventFormBody } from './EventFormBody';

export function defineEventAttributes<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
>(
  beforeDescriptionAttributes?: SA1,
  afterDescriptionAttributes?: SA2
): BaseEventAttributes & SA1 & SA2 {
  return defineSchemaAttributes({
    ...baseEventAttributes,
    ...beforeDescriptionAttributes,
    ...afterDescriptionAttributes,
  }) as BaseEventAttributes & SA1 & SA2;
}

interface EventDialogProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> {
  isOpen: boolean;
  title?: string;
  beforeDescriptionAttributes?: SA1;
  afterDescriptionAttributes?: SA2;
  values: Partial<Nullable<InferredSchemaType<BaseEventAttributes>>>;
  onSubmit?: (data: {
    modifiedValues: Partial<Nullable<InferredSchemaType<BaseEventAttributes>>>;
    values: Nullable<InferredSchemaType<BaseEventAttributes>>;
  }) => Promise<void>;
  onCancel?: () => void;
  onDismiss?: () => void;
  eventResolver?: CalendarEventResolverFn;
  config: CalendarConfig;
}

export function EventDialog<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
>(props: Readonly<EventDialogProps<SA1, SA2>>) {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={() => {
        props.onDismiss?.();
      }}
    >
      <DialogSurface style={{ maxWidth: 480 }}>
        <EventFormBody
          values={props.values}
          config={props.config}
          onCancel={props.onCancel}
          onSubmit={props.onSubmit}
        />
      </DialogSurface>
    </Dialog>
  );
}

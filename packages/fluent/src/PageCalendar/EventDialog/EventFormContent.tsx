import { DialogContent, tokens } from '@fluentui/react-components';
import { baseEventAttributes } from '@headless-adminapp/app/calendar/baseEventAttributes';
import { CalendarConfig } from '@headless-adminapp/app/calendar/types';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { Path, UseFormReturn } from 'react-hook-form';

import { AttributeController } from '../../form/AttributeController';
import { BaseFieldValues } from './types';

interface EventFormContentProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> {
  form: UseFormReturn<BaseFieldValues>;
  beforeDescriptionAttributes?: SA1;
  afterDescriptionAttributes?: SA2;
  readOnly?: boolean;
  config: CalendarConfig;
}

export function EventFormContent<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
>({
  form,
  afterDescriptionAttributes,
  beforeDescriptionAttributes,
  readOnly,
  config,
}: Readonly<EventFormContentProps<SA1, SA2>>) {
  const allDay = form.watch('allDay');

  return (
    <DialogContent>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacingVerticalM,
          marginTop: tokens.spacingVerticalL,
          marginBottom: tokens.spacingVerticalL,
        }}
      >
        <AttributeController
          control={form.control}
          attributeName="title"
          attribute={baseEventAttributes.title}
          readOnly={readOnly}
        />
        <AttributeController
          control={form.control}
          attributeName="start"
          attribute={{
            ...baseEventAttributes.start,
            ...(allDay ? { format: 'date' } : { format: 'datetime' }),
          }}
          readOnly={readOnly}
        />
        <AttributeController
          control={form.control}
          attributeName="end"
          attribute={{
            ...baseEventAttributes.end,
            ...(allDay ? { format: 'date' } : { format: 'datetime' }),
          }}
          readOnly={readOnly}
        />
        {!config.disableAllDay && (
          <AttributeController
            control={form.control}
            attributeName="allDay"
            attribute={baseEventAttributes.allDay}
            readOnly={readOnly}
          />
        )}
        {Object.entries(beforeDescriptionAttributes ?? {}).map(
          ([attributeName, attribute]) => {
            return (
              <AttributeController
                key={attributeName}
                control={form.control}
                attributeName={attributeName as Path<BaseFieldValues>}
                attribute={attribute}
                readOnly={readOnly}
              />
            );
          }
        )}
        <AttributeController
          control={form.control}
          attributeName="description"
          attribute={baseEventAttributes.description}
          readOnly={readOnly}
        />
        {Object.entries(afterDescriptionAttributes ?? {}).map(
          ([attributeName, attribute]) => {
            return (
              <AttributeController
                key={attributeName}
                control={form.control}
                attributeName={attributeName as Path<BaseFieldValues>}
                attribute={attribute}
                readOnly={readOnly}
              />
            );
          }
        )}
      </div>
    </DialogContent>
  );
}

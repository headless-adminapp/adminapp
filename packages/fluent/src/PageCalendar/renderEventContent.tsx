import {
  Button,
  Divider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
} from '@fluentui/react-components';
import type { EventContentArg } from '@fullcalendar/core';
import { useConfig } from '@headless-adminapp/app/calendar/hooks/useConfig';
import { useDeleteEvent } from '@headless-adminapp/app/calendar/hooks/useDeleteEvent';
import { useOpenDetailDialog } from '@headless-adminapp/app/calendar/hooks/useOpenDetailDialog';
import { useLocale } from '@headless-adminapp/app/locale';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { useRouter, useRouteResolver } from '@headless-adminapp/app/route';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import { FC, useState } from 'react';

import { EventDialog } from './EventDialog/EventDialog';

export function renderEventContent(eventInfo: EventContentArg) {
  return <EventContent eventInfo={eventInfo} />;
}

const EventContent: FC<{ eventInfo: EventContentArg }> = ({ eventInfo }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      positioning="after"
      withArrow
      open={open}
      onOpenChange={(e, data) => setOpen(data.open)}
    >
      <PopoverTrigger>
        <div
          style={{
            display: 'flex',
            backgroundColor: tokens.colorBrandBackground2,
            color: tokens.colorNeutralForeground1,
            borderRadius: tokens.borderRadiusMedium,
            paddingBlock: tokens.spacingVerticalXXS,
            paddingInline: tokens.spacingHorizontalS,
            border: `1px solid ${tokens.colorBrandStroke2}`,
            gap: tokens.spacingHorizontalS,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '100%',
            cursor: 'pointer',
          }}
        >
          {eventInfo.timeText && <span>{eventInfo.timeText}</span>}
          <span style={{ fontWeight: tokens.fontWeightSemibold }}>
            {eventInfo.event.title}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverSurface style={{ maxWidth: 600 }}>
        <PopoverContent eventInfo={eventInfo} onClose={() => setOpen(false)} />
      </PopoverSurface>
    </Popover>
  );
};

const PopoverContent: FC<{
  eventInfo: EventContentArg;
  onClose: () => void;
}> = ({ eventInfo, onClose }) => {
  const config = useConfig();
  const { dateFormats, timeFormats } = useLocale();
  const deleteEvent = useDeleteEvent();
  const openEventDetailModel = useOpenDetailDialog(EventDialog);
  const router = useRouter();
  const routeResolver = useRouteResolver();
  const openForm = useOpenForm();

  const handleEdit = () => {
    if (!config.editOptions) {
      return;
    }

    onClose();

    if (config.editOptions.mode === 'dialog') {
      openEventDetailModel({
        id: eventInfo.event.id,
        title: eventInfo.event.title,
        start: eventInfo.event.start?.toISOString(),
        end: eventInfo.event.end?.toISOString(),
        allDay: eventInfo.event.allDay,
        description: '',
        ...eventInfo.event.extendedProps,
      });
    } else if (config.editOptions.mode === 'custom') {
      config.editOptions.onClick(eventInfo.event, {
        openForm,
        router,
        routeResolver,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: tokens.spacingHorizontalM,
          paddingBottom: tokens.spacingVerticalM,
        }}
      >
        <div
          style={{
            fontWeight: tokens.fontWeightBold,
            fontSize: tokens.fontSizeBase400,
            flex: 1,
            alignSelf: 'center',
          }}
        >
          {eventInfo.event.title}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.spacingHorizontalS,
          }}
        >
          {!!config.deleteEvent && (
            <Button
              icon={<Icons.Delete size={16} />}
              appearance="subtle"
              onClick={async () => {
                onClose();
                await deleteEvent(eventInfo.event.id);
              }}
            />
          )}
          {!!config.editOptions && (
            <Button
              icon={<Icons.Edit size={16} />}
              appearance="subtle"
              onClick={handleEdit}
            />
          )}
          <Button
            icon={<Icons.Close size={16} />}
            appearance="subtle"
            onClick={onClose}
          />
        </div>
      </div>
      <div>
        <Divider style={{ opacity: 0.5 }} />
      </div>
      <div
        style={{
          paddingTop: tokens.spacingVerticalM,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacingVerticalM,
        }}
      >
        <div>
          {dayjs(eventInfo.event.start).format(dateFormats.long)}{' '}
          {dayjs(eventInfo.event.start).format(timeFormats.short)}{' '}
          {eventInfo.event.allDay
            ? 'All Day'
            : '- ' + dayjs(eventInfo.event.end).format(timeFormats.short)}
        </div>
        <div>{eventInfo.event.extendedProps.description}</div>
      </div>
    </div>
  );
};

import { defineSchemaAttributes } from '@headless-adminapp/core/schema/utils';

export const baseEventAttributes = defineSchemaAttributes({
  id: {
    type: 'id',
    label: 'ID',
    string: true,
  },
  title: {
    type: 'string',
    format: 'text',
    label: 'Title',
    required: true,
  },
  start: {
    type: 'date',
    format: 'datetime',
    label: 'Start',
    required: true,
  },
  end: {
    type: 'date',
    format: 'datetime',
    label: 'End',
    required: true,
  },
  allDay: {
    type: 'boolean',
    label: 'All day',
  },
  description: {
    type: 'string',
    format: 'textarea',
    label: 'Description',
  },
});

export type BaseEventAttributes = typeof baseEventAttributes;

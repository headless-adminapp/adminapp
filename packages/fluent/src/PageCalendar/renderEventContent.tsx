import { tokens } from '@fluentui/react-components';
import type { EventContentArg } from '@fullcalendar/core';

export function renderEventContent(eventInfo: EventContentArg) {
  return (
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
  );
}

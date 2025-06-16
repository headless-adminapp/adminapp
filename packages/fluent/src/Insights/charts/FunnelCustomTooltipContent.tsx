import { Caption1, Divider, tokens } from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';

import { formatNumber } from './formatters';

export const FunnelCustomTooltipContent = ({
  active,
  payload,
  valueFormatter,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  valueFormatter: (value: unknown) => string;
}) => {
  const locale = useLocale();

  if (!active || !payload?.length) {
    return null;
  }

  const [firstPayload] = payload;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: tokens.shadow16,
        backgroundColor: tokens.colorNeutralBackground1,
        padding: 8,
        borderRadius: 4,
        gap: 4,
      }}
    >
      <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
        {firstPayload.label}
      </Caption1>
      <Divider style={{ opacity: 0.2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 8,
              height: 8,
              background: firstPayload.payload.fill,
              borderRadius: 4,
            }}
          />
          <Caption1
            style={{ color: tokens.colorNeutralForeground4, marginLeft: 8 }}
          >
            {valueFormatter(firstPayload.value)}
          </Caption1>
          <div style={{ flex: 1, minWidth: 50 }} />
          <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
            {formatNumber(locale, firstPayload.payload.perc * 100, {
              maxDigit: 2,
            })}
            %
          </Caption1>
        </div>
      </div>
    </div>
  );
};

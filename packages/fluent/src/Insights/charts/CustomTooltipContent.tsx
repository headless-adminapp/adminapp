import { Caption1, Divider, tokens } from '@fluentui/react-components';

export const CustomTooltipContent = ({
  active,
  payload,
  label,
  xAxisFormatter,
  yAxisFormatter,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label: string;
  xAxisFormatter: (value: unknown) => string;
  yAxisFormatter: (value: unknown) => string;
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

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
        {xAxisFormatter(label)}
      </Caption1>
      <Divider style={{ opacity: 0.2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {payload.map(
          (
            item: { color: string; name: string; value: unknown },
            index: number
          ) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: item.color,
                  borderRadius: 4,
                }}
              />
              <Caption1
                style={{ color: tokens.colorNeutralForeground4, marginLeft: 8 }}
              >
                {item.name}
              </Caption1>
              <div style={{ flex: 1, minWidth: 50 }} />
              <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                {yAxisFormatter(item.value)}
              </Caption1>
            </div>
          )
        )}
      </div>
    </div>
  );
};

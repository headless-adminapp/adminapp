/* eslint-disable @typescript-eslint/no-explicit-any */
import { Caption1, tokens } from '@fluentui/react-components';
import { RadarChartInfo } from '@headless-adminapp/core/experience/insights';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RadarChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import {
  createAxisFormatter,
  createLongAxisFormatter,
  Formatter,
} from './formatters';

export function RadarChart({
  dataset,
  chartInfo,
}: Readonly<{
  dataset: any[];
  chartInfo: RadarChartInfo;
}>) {
  const data = dataset[0];
  const radar = chartInfo.radar[0];

  const nameFormatter = createLongAxisFormatter(radar.nameTick);
  const valueFormatter = createLongAxisFormatter(radar.dataTick);
  const tickFormatter = createAxisFormatter(radar.dataTick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChartInternal cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={tokens.colorNeutralBackground6} opacity={0.5} />
        <PolarAngleAxis
          dataKey={radar.nameKey}
          fontSize={tokens.fontSizeBase100}
          tickFormatter={nameFormatter}
        />
        <PolarRadiusAxis
          fontSize={tokens.fontSizeBase100}
          tickFormatter={tickFormatter}
        />
        <Radar
          dataKey={radar.dataKey}
          stroke={radar.color ?? '#8884d8'}
          fill={radar.color ?? '#8884d8'}
          fillOpacity={0.6}
        />
        <Tooltip
          cursor={{
            stroke: tokens.colorNeutralBackground6,
            opacity: 0.5,
          }}
          content={({ payload }) =>
            renderTooltipContent({
              payload,
              nameFormatter,
              valueFormatter,
              radar,
            })
          }
        />
      </RadarChartInternal>
    </ResponsiveContainer>
  );
}

function renderTooltipContent({
  payload,
  nameFormatter,
  valueFormatter,
  radar,
}: {
  payload: Payload<ValueType, NameType>[] | undefined;
  nameFormatter: Formatter;
  valueFormatter: Formatter;
  radar: RadarChartInfo['radar'][0];
}) {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {payload?.map((item: any, index: number) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Caption1
              style={{
                color: tokens.colorNeutralForeground4,
                marginLeft: 8,
              }}
            >
              {nameFormatter(item.payload[radar.nameKey])}
            </Caption1>
            <div style={{ flex: 1, minWidth: 50 }} />
            <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
              {valueFormatter(item.value)}
            </Caption1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadarChart;

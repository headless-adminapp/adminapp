import { Caption1, Divider, tokens } from '@fluentui/react-components';
import {
  DateAxisTickInterval,
  OhlcChartInfo,
} from '@headless-adminapp/core/experience/insights';
import { useMemo } from 'react';
import {
  Rectangle,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis as XAxisInternal,
} from 'recharts';

import { createAxisFormatter, createLongAxisFormatter } from './formatters';
import { renderGrid, renderYAxis } from './renderers';

export const barSizeInTime = (interval: DateAxisTickInterval) => {
  switch (interval) {
    case DateAxisTickInterval.Minute:
      return 60000 * 0.6;
    case DateAxisTickInterval.Hour:
      return 3600000 * 0.6;
    case DateAxisTickInterval.Day:
      return 86400000 * 0.6;
    case DateAxisTickInterval.Week:
      return 604800000 * 0.6;
    case DateAxisTickInterval.Month:
      return 2628000000 * 0.6;
    case DateAxisTickInterval.Year:
      return 31540000000 * 0.6;
    default:
      return 60000 * 0.6;
  }
};

export function OhlcChart({
  dataset,
  chartInfo,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: OhlcChartInfo;
}) {
  const bar = chartInfo.bars[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = dataset[bar.dataIndex ?? 0];

  const domain: [number, number] = useMemo(() => {
    if (
      chartInfo.yAxis.domain &&
      typeof chartInfo.yAxis.domain[0] === 'number' &&
      typeof chartInfo.yAxis.domain[1] === 'number'
    ) {
      return chartInfo.yAxis.domain as [number, number];
    }

    const dataMin = Math.min(
      ...data.map((entry) => entry[bar.low.dataKey]),
      ...data.map((entry) => entry[bar.open.dataKey]),
      ...data.map((entry) => entry[bar.close.dataKey]),
      ...data.map((entry) => entry[bar.high.dataKey])
    );

    const dataMax = Math.max(
      ...data.map((entry) => entry[bar.low.dataKey]),
      ...data.map((entry) => entry[bar.open.dataKey]),
      ...data.map((entry) => entry[bar.close.dataKey]),
      ...data.map((entry) => entry[bar.high.dataKey])
    );

    return [dataMin, dataMax];
  }, [bar, chartInfo.yAxis.domain, data]);

  const xAxis = chartInfo.xAxis;

  const xAxisFormatter = createAxisFormatter(xAxis.tick);

  const xAxisLongFormatter = createLongAxisFormatter(chartInfo.xAxis.tick);
  const yAxisLongFormatter = createLongAxisFormatter(chartInfo.yAxis.tick);

  console.log('temp.data', dataset, chartInfo);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart data={data}>
        {renderGrid()}
        {renderYAxis({
          ...chartInfo.yAxis,
          domain,
        })}

        <XAxisInternal
          dataKey={xAxis.dataKey}
          name={xAxis.name}
          tickFormatter={xAxisFormatter}
          tickLine={false}
          minTickGap={10}
          padding="gap"
          axisLine={{
            stroke: tokens.colorNeutralBackground6,
          }}
          fontSize={tokens.fontSizeBase100}
          tick={{
            fill: tokens.colorNeutralForeground1,
            opacity: 0.5,
          }}
          scale={xAxis.tick.type === 'time' ? 'time' : 'auto'}
          type={xAxis.tick.type === 'category' ? 'category' : 'number'}
          domain={xAxis.domain}
          height={16}
        />

        <Scatter
          yAxisId="left"
          data={data}
          markerWidth={1}
          width={1}
          strokeWidth={1}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shape={(props: any) => {
            const { x, width, payload, yAxis, xAxis } = props;

            const xValue = payload[xAxis.dataKey!];
            const open = payload[bar.open.dataKey];
            const close = payload[bar.close.dataKey];
            const high = payload[bar.high.dataKey];
            const low = payload[bar.low.dataKey];

            const color =
              open < close
                ? bar.colors?.[0] ?? tokens.colorPaletteGreenForeground1
                : bar.colors?.[1] ?? tokens.colorPaletteRedForeground1;

            const xPosition = xAxis.scale(xValue);

            let xWidth = 30;

            if (
              chartInfo.xAxis.tick.type === 'time' &&
              chartInfo.xAxis.tick.interval
            ) {
              xWidth =
                xAxis.scale(
                  xValue + barSizeInTime(chartInfo.xAxis.tick.interval)
                ) - xPosition;
            }

            return (
              <g>
                <Rectangle
                  x={x + width / 2}
                  y={yAxis.scale(high)} // Adjust the y to position the bar correctly
                  width={1}
                  height={yAxis.scale(low) - yAxis.scale(high)}
                  fill={color}
                  stroke={color}
                  strokeWidth={1}
                />
                <Rectangle
                  x={xPosition - xWidth / 2}
                  y={Math.min(yAxis.scale(open), yAxis.scale(close))} // Adjust the y to position the bar correctly
                  width={xWidth}
                  height={Math.abs(yAxis.scale(close) - yAxis.scale(open))}
                  fill={color}
                  stroke={color}
                  strokeWidth={1}
                />
              </g>
            );
          }}
        />
        <Tooltip
          cursor={{
            stroke: tokens.colorNeutralBackground6,
            opacity: 0.5,
          }}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) {
              return <></>;
            }

            return (
              <OhclTooltipContent
                payload={payload[0]}
                bar={bar}
                xAxisFormatter={xAxisLongFormatter}
                yAxisFormatter={yAxisLongFormatter}
              />
            );
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function OhclTooltipContent({
  payload,
  bar,
  xAxisFormatter,
  yAxisFormatter,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  bar: OhlcChartInfo['bars'][0];
  xAxisFormatter: (value: unknown) => string;
  yAxisFormatter: (value: unknown) => string;
}) {
  const items: Array<{
    name: string;
    value: number;
  }> = [];

  items.push({
    name: bar.open.dataLabel,
    value: payload.payload[bar.open.dataKey],
  });

  items.push({
    name: bar.high.dataLabel,
    value: payload.payload[bar.high.dataKey],
  });

  items.push({
    name: bar.low.dataLabel,
    value: payload.payload[bar.low.dataKey],
  });

  items.push({
    name: bar.close.dataLabel,
    value: payload.payload[bar.close.dataKey],
  });

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
        <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
          {xAxisFormatter(payload.value)}
        </Caption1>
        <Divider style={{ opacity: 0.2 }} />
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
              {item.name}
            </Caption1>
            <div style={{ flex: 1, minWidth: 50 }} />
            <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
              {yAxisFormatter(item.value)}
            </Caption1>
          </div>
        ))}
      </div>
    </div>
  );
}
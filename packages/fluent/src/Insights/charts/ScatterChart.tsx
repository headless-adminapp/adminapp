import { Caption1, Divider, tokens } from '@fluentui/react-components';
import { ScatterChartInfo } from '@headless-adminapp/core/experience/insights';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart as ScatterChartInternal,
  Tooltip,
  ZAxis,
} from 'recharts';

import { defaultColors } from './constants';
import { createLongAxisFormatter } from './formatters';
import { renderGrid, renderXAxis, renderYAxis } from './renderers';

export function ScatterChart({
  dataset,
  chartInfo,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: ScatterChartInfo;
}>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChartInternal>
        {renderGrid()}
        {renderXAxis(chartInfo.xAxis, false, { left: 10, right: 10 })}
        {renderYAxis(chartInfo.yAxis)}
        <ZAxis
          type="number"
          dataKey={chartInfo.zAxis.dataKey}
          range={chartInfo.zAxis.range}
          name={chartInfo.zAxis.name}
        />
        {chartInfo.scatters.map((scatter, index) => (
          <Scatter
            key={index}
            yAxisId="left"
            name={scatter.dataLabel}
            data={dataset[scatter.dataIndex ?? 0]}
            dataKey={scatter.dataKey}
            fill={scatter.color ?? defaultColors[index]}
          />
        ))}
        <Tooltip
          cursor={false}
          content={(props) => {
            if (!props.active || !props.payload?.length) {
              return <></>;
            }

            return (
              <ScatterTooltipContent
                active={props.active}
                payload={props.payload}
                chartInfo={chartInfo}
                dataset={dataset}
              />
            );
          }}
        />
      </ScatterChartInternal>
    </ResponsiveContainer>
  );
}

const ScatterTooltipContent = (props: {
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any[];
  chartInfo: ScatterChartInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
}) => {
  const chartInfo = props.chartInfo;
  const dataset = props.dataset;

  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;
  const zAxis = chartInfo.zAxis;

  const xPayload = props.payload[0];
  const yPayload = props.payload[1];

  const xValue = xPayload.value;
  const yValue = yPayload.value;

  const findKey = xValue + ':' + yValue;

  const items: Array<{
    name: string;
    value: number;
    color: string;
  }> = useMemo(() => {
    const _items: Array<{
      name: string;
      value: number;
      color: string;
    }> = [];

    if (!xAxis.dataKey || !yAxis.dataKey || !zAxis.dataKey) {
      return _items;
    }

    const datasetDict = dataset.map((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.reduce((acc: any, entry: any) => {
        const key = entry[xAxis.dataKey!] + ':' + entry[yAxis.dataKey!];

        acc[key] = entry;
        return acc;
      }, {});
    });

    for (let i = 0; i < chartInfo.scatters.length; i++) {
      const scatter = chartInfo.scatters[i];

      const zValue =
        datasetDict[scatter.dataIndex ?? 0]?.[findKey]?.[zAxis.dataKey!];

      if (zValue === undefined) {
        continue;
      }

      _items.push({
        name: scatter.dataLabel,
        value: zValue,
        color: scatter.color ?? defaultColors[i],
      });
    }

    return _items;
  }, [
    chartInfo.scatters,
    dataset,
    findKey,
    xAxis.dataKey,
    yAxis.dataKey,
    zAxis.dataKey,
  ]);

  const xAxisFormatter = createLongAxisFormatter(xAxis.tick);
  const yAxisFormatter = createLongAxisFormatter(yAxis.tick);
  const zAxisFormatter = createLongAxisFormatter(zAxis.tick);

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
            {xAxis.name}
          </Caption1>
          <div style={{ flex: 1, minWidth: 50 }} />
          <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
            {xAxisFormatter(xValue)}
          </Caption1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
            {yAxis.name}
          </Caption1>
          <div style={{ flex: 1, minWidth: 50 }} />
          <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
            {yAxisFormatter(yValue)}
          </Caption1>
        </div>
        <Divider style={{ opacity: 0.2 }} />
        {items.map((item, index: number) => (
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
              {zAxisFormatter(item.value)}
            </Caption1>
          </div>
        ))}
      </div>
    </div>
  );
};

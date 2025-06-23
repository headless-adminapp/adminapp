import { tokens } from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
import { ComposedChartInfo } from '@headless-adminapp/core/experience/insights';
import { useCallback, useId, useMemo } from 'react';
import {
  ComposedChart as ComposedChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CustomTooltipContent } from './CustomTooltipContent';
import { createLongAxisFormatter } from './formatters';
import {
  renderAreas,
  renderBars,
  renderGrid,
  renderLines,
  renderXAxis,
  renderYAxis,
} from './renderers';

export function ComposedChart({
  dataset,
  chartInfo,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: ComposedChartInfo;
}>) {
  const id = useId();
  const locale = useLocale();
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;
  const rightYAxis = chartInfo.rightYAxis;

  const xAxisFullFormatter = createLongAxisFormatter(locale, xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(locale, yAxis.tick);
  const rightYAxisFullFormatter = createLongAxisFormatter(
    locale,
    rightYAxis?.tick ?? yAxis.tick
  );

  const yAxisIdMapping = useMemo(() => {
    const mapping: Record<string, 'left' | 'right'> = {};
    chartInfo.bars?.forEach((bar) => {
      mapping[bar.dataKey] = bar.yAxisId ?? 'left';
    });
    chartInfo.areas?.forEach((area) => {
      mapping[area.dataKey] = area.yAxisId ?? 'left';
    });
    chartInfo.lines?.forEach((line) => {
      mapping[line.dataKey] = line.yAxisId ?? 'left';
    });
    return mapping;
  }, [chartInfo]);

  const yAxisIdResolver = useCallback(
    (dataKey: string) => {
      return yAxisIdMapping[dataKey] ?? 'left';
    },
    [yAxisIdMapping]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChartInternal data={dataset[0]}>
        {renderGrid()}
        {renderYAxis(locale, yAxis)}
        {!!rightYAxis && renderYAxis(locale, rightYAxis, 'right')}
        {renderXAxis(locale, xAxis, !!chartInfo.bars?.length)}
        {renderLines(chartInfo.lines ?? [])}
        {renderAreas(chartInfo.areas ?? [], id)}
        {renderBars(chartInfo.bars ?? [], dataset)}
        <Tooltip
          cursor={{
            stroke: tokens.colorNeutralBackground6,
            opacity: 0.5,
          }}
          content={({ active, payload, label }) => (
            <CustomTooltipContent
              xAxisFormatter={xAxisFullFormatter}
              yAxisFormatter={yAxisFullFormatter}
              yAxisIdResolver={yAxisIdResolver}
              rightYAxisFormatter={rightYAxisFullFormatter}
              active={active}
              payload={payload}
              label={label}
            />
          )}
        />
      </ComposedChartInternal>
    </ResponsiveContainer>
  );
}

export default ComposedChart;

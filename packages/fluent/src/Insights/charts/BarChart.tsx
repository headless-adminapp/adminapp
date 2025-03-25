import { tokens } from '@fluentui/react-components';
import { BarChartInfo } from '@headless-adminapp/core/experience/insights';
import {
  BarChart as BarChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CustomTooltipContent } from './CustomTooltipContent';
import { createLongAxisFormatter } from './formatters';
import { renderBars, renderGrid, renderXAxis, renderYAxis } from './renderers';

export function BarChart({
  dataset,
  chartInfo,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: BarChartInfo;
}>) {
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;
  const bars = chartInfo.bars;

  const xAxisFullFormatter = createLongAxisFormatter(xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(yAxis.tick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartInternal data={dataset[0]} stackOffset={chartInfo.stackOffset}>
        {renderGrid()}
        {renderYAxis(yAxis)}
        {renderXAxis(xAxis)}
        {renderBars(bars, dataset)}
        <Tooltip
          cursor={{
            fill: tokens.colorNeutralBackground6,
            opacity: 0.2,
          }}
          content={({ active, payload, label }) => (
            <CustomTooltipContent
              xAxisFormatter={xAxisFullFormatter}
              yAxisFormatter={yAxisFullFormatter}
              active={active}
              payload={payload}
              label={label}
            />
          )}
        />
      </BarChartInternal>
    </ResponsiveContainer>
  );
}

export default BarChart;

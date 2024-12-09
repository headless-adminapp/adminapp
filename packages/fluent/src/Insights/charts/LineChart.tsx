import { tokens } from '@fluentui/react-components';
import { LineChartInfo } from '@headless-adminapp/core/experience/insights';
import {
  LineChart as LineChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CustomTooltipContent } from './CustomTooltipContent';
import { createLongAxisFormatter } from './formatters';
import { renderGrid, renderLines, renderXAxis, renderYAxis } from './renderers';

export function LineChart({
  dataset,
  chartInfo,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: LineChartInfo;
}) {
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;
  const lines = chartInfo.lines;

  const xAxisFullFormatter = createLongAxisFormatter(xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(yAxis.tick);

  console.log('dataset', dataset, chartInfo);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChartInternal>
        {renderGrid()}
        {renderYAxis(yAxis)}
        {renderXAxis(xAxis)}
        {renderLines(lines, dataset)}
        <Tooltip
          cursor={{
            stroke: tokens.colorNeutralBackground6,
            opacity: 0.5,
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
      </LineChartInternal>
    </ResponsiveContainer>
  );
}
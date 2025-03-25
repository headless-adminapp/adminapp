import { tokens } from '@fluentui/react-components';
import { ComposedChartInfo } from '@headless-adminapp/core/experience/insights';
import { useId } from 'react';
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
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: ComposedChartInfo;
}) {
  const id = useId();
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;

  const xAxisFullFormatter = createLongAxisFormatter(xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(yAxis.tick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChartInternal data={dataset[0]}>
        {renderGrid()}
        {renderYAxis(yAxis)}
        {renderXAxis(xAxis, !!chartInfo.bars?.length)}
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

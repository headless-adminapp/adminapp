import { tokens } from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
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
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: LineChartInfo;
}>) {
  const locale = useLocale();
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;
  const lines = chartInfo.lines;

  const xAxisFullFormatter = createLongAxisFormatter(locale, xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(locale, yAxis.tick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChartInternal data={dataset[0]}>
        {renderGrid()}
        {renderYAxis(locale, yAxis)}
        {renderXAxis(locale, xAxis)}
        {renderLines(lines)}
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

export default LineChart;

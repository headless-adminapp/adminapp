import { tokens } from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
import { AreaChartInfo } from '@headless-adminapp/core/experience/insights';
import { useId } from 'react';
import {
  AreaChart as AreaChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CustomTooltipContent } from './CustomTooltipContent';
import { createLongAxisFormatter } from './formatters';
import { renderAreas, renderGrid, renderXAxis, renderYAxis } from './renderers';

export function AreaChart({
  dataset,
  chartInfo,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  chartInfo: AreaChartInfo;
}>) {
  const id = useId();
  const locale = useLocale();
  const xAxis = chartInfo.xAxis;
  const yAxis = chartInfo.yAxis;

  const areas = chartInfo.areas;

  const xAxisFullFormatter = createLongAxisFormatter(locale, xAxis.tick);
  const yAxisFullFormatter = createLongAxisFormatter(locale, yAxis.tick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChartInternal data={dataset[0]}>
        {renderGrid()}
        {renderXAxis(locale, xAxis)}
        {renderYAxis(locale, yAxis)}
        {renderAreas(areas, id)}
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
      </AreaChartInternal>
    </ResponsiveContainer>
  );
}

export default AreaChart;

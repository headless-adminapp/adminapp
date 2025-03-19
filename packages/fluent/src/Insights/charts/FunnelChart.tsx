import { tokens } from '@fluentui/react-components';
import { FunnelChartInfo } from '@headless-adminapp/core/experience/insights';
import { useMemo, useRef } from 'react';
import {
  Funnel,
  FunnelChart as FunnelChartInternal,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { defaultColors } from './constants';
import { createLongAxisFormatter } from './formatters';
import { FunnelCustomTooltipContent } from './FunnelCustomTooltipContent';

export function FunnelChart({
  dataset,
  chartInfo,
}: Readonly<{
  dataset: any[];
  chartInfo: FunnelChartInfo;
}>) {
  const item = chartInfo;
  const nameFormatter = createLongAxisFormatter({
    type: 'category',
    options: item.nameTick?.options,
  });

  const nameFormatterRef = useRef(nameFormatter);
  nameFormatterRef.current = nameFormatter;

  const data = dataset[0] as any[];

  const valueFormatter = createLongAxisFormatter(item.dataTick);

  const transformedData = useMemo(() => {
    let total = data[0][item.dataKey] ?? 0;

    return data.map((dataItem, index) => {
      const perc = total ? dataItem[item.dataKey] / total : 0;
      const label = nameFormatterRef.current(dataItem[item.nameKey]);

      const labelWithPerc = `${label} (${(perc * 100).toFixed(0)}%)`;
      return {
        value: dataItem[item.dataKey],
        label: label,
        labelWithPerc,
        name: dataItem[item.nameKey],
        fill:
          item.colorKey && dataItem[item.colorKey]
            ? dataItem[item.colorKey]
            : (item.colors ?? defaultColors)[
                index % (item.colors ?? defaultColors).length
              ],
        perc,
      };
    });
  }, [data, item]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <FunnelChartInternal>
        <Tooltip
          content={({ active, payload }) => {
            return (
              <FunnelCustomTooltipContent
                valueFormatter={valueFormatter}
                active={active}
                payload={payload}
              />
            );
          }}
        />
        <Funnel
          dataKey="value"
          data={transformedData}
          isAnimationActive={false}
          lastShapeType="rectangle"
        >
          <LabelList
            position="inside"
            fill="#000"
            stroke="none"
            dataKey="labelWithPerc"
            style={{
              fontSize: tokens.fontSizeBase100,
              fontFamily: tokens.fontFamilyBase,
              fill: tokens.colorNeutralForeground1,
            }}
            content={({ content: _, ...props }) => <Label {...props} />}
          />
        </Funnel>
      </FunnelChartInternal>
    </ResponsiveContainer>
  );
}

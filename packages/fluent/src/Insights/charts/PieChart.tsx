/* eslint-disable @typescript-eslint/no-explicit-any */
import { Caption1, tokens } from '@fluentui/react-components';
import { PieChartInfo } from '@headless-adminapp/core/experience/insights';
import {
  Cell,
  Legend,
  Pie,
  PieChart as PieChartInternal,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { defaultColors } from './constants';
import { createLongAxisFormatter } from './formatters';

export function PieChart({
  dataset,
  chartInfo,
}: {
  dataset: any[];
  chartInfo: PieChartInfo;
}) {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={tokens.fontSizeBase100}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const item = chartInfo.pie[0];

  const nameFormatter = createLongAxisFormatter(item.nameTick);
  const valueFormatter = createLongAxisFormatter(item.dataTick);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChartInternal>
        <Pie
          data={dataset[item.dataIndex ?? 0]}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          dataKey={item.dataKey}
          nameKey={item.nameKey}
        >
          {dataset[item.dataIndex ?? 0].map(
            (entry: Record<string, string>, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  item.colorKey && entry[item.colorKey]
                    ? entry[item.colorKey]
                    : (item.colors ?? defaultColors)[
                        index % (item.colors ?? defaultColors).length
                      ]
                }
              />
            )
          )}
        </Pie>
        {chartInfo.showLegend && (
          <Legend
            align="right"
            layout="vertical"
            verticalAlign="top"
            wrapperStyle={{
              fontSize: tokens.fontSizeBase100,
              fontFamily: tokens.fontFamilyBase,
              overflow: 'auto',
              top: 5,
              bottom: 5,
            }}
          />
        )}
        <Tooltip
          cursor={{
            stroke: tokens.colorNeutralBackground6,
            opacity: 0.5,
          }}
          content={({ payload }) => {
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
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  {payload?.map((item: any, index: number) => (
                    <div
                      key={index}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Caption1
                        style={{
                          color: tokens.colorNeutralForeground4,
                          marginLeft: 8,
                        }}
                      >
                        {nameFormatter(item.name)}
                      </Caption1>
                      <div style={{ flex: 1, minWidth: 50 }} />
                      <Caption1
                        style={{ color: tokens.colorNeutralForeground4 }}
                      >
                        {valueFormatter(item.value)}
                      </Caption1>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
      </PieChartInternal>
    </ResponsiveContainer>
  );
}

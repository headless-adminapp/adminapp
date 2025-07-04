import { tokens } from '@fluentui/react-components';
import {
  AreaInfo,
  BarInfo,
  LineInfo,
  XAxis,
  YAxis,
} from '@headless-adminapp/core/experience/insights';
import { Locale } from '@headless-adminapp/core/experience/locale';
import { Fragment } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  Line,
  XAxis as XAxisInternal,
  XAxisProps,
  YAxis as YAxisInternal,
} from 'recharts';

import { createAxisFormatter } from './formatters';

export function renderXAxis(
  locale: Locale,
  axis: XAxis,
  forceCategory = false,
  padding: XAxisProps['padding'] = 'gap'
) {
  const xAxisFormatter = createAxisFormatter(locale, axis.tick);

  return (
    <XAxisInternal
      dataKey={axis.dataKey}
      name={axis.name}
      tickFormatter={xAxisFormatter}
      tickLine={false}
      minTickGap={10}
      // padding={{ left: 10, right: 10 }}
      padding={padding}
      axisLine={{
        stroke: tokens.colorNeutralBackground6,
      }}
      fontSize={tokens.fontSizeBase100}
      tick={{
        fill: tokens.colorNeutralForeground1,
        opacity: 0.5,
      }}
      scale={!forceCategory && axis.tick.type === 'time' ? 'time' : 'auto'}
      type={
        forceCategory || axis.tick.type === 'category' ? 'category' : 'number'
      }
      domain={axis.domain}
      height={16}
    />
  );
}

export function renderYAxis(
  locale: Locale,
  axis: YAxis,
  axisId: 'left' | 'right' = 'left'
) {
  const yAxisFormatter = createAxisFormatter(locale, axis.tick);

  return (
    <YAxisInternal
      yAxisId={axisId}
      dataKey={axis.dataKey}
      orientation={axisId === 'right' ? 'right' : 'left'}
      tickFormatter={yAxisFormatter}
      name={axis.name}
      tickLine={false}
      fontSize={tokens.fontSizeBase100}
      axisLine={false}
      tickMargin={0}
      minTickGap={0}
      accentHeight={0}
      width={40}
      scale="auto"
      type="number"
      domain={axis.domain}
      tick={{
        fill: tokens.colorNeutralForeground1,
        opacity: 0.5,
      }}
    />
  );
}

export function renderGrid() {
  return (
    <CartesianGrid
      strokeDasharray="8 4"
      vertical={false}
      strokeWidth={0.2}
      stroke={tokens.colorNeutralBackground6}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderLine(line: LineInfo) {
  return (
    <Line
      key={line.dataKey}
      yAxisId={line.yAxisId ?? 'left'}
      type={line.curveType}
      dataKey={line.dataKey}
      name={line.dataLabel}
      stroke={line.color}
      strokeWidth={2}
      dot={false}
      activeDot={{
        stroke: line.color,
      }}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderLines(lines: LineInfo[]) {
  return lines.map((line) => renderLine(line));
}

// eslint-disable-next-line unused-imports/no-unused-vars
export function renderArea(area: AreaInfo, chartId: string) {
  return (
    <Fragment key={area.dataKey}>
      <defs>
        <linearGradient
          id={chartId + ':' + area.dataKey}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
          <stop offset="95%" stopColor={area.color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        yAxisId={area.yAxisId ?? 'left'}
        type={area.curveType}
        dataKey={area.dataKey}
        name={area.dataLabel}
        stroke={area.color}
        // fill={area.color}
        fill={`url(#${chartId}:${area.dataKey})`}
        strokeWidth={2}
        dot={false}
        activeDot={{
          stroke: area.color,
        }}
      />
    </Fragment>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderAreas(areas: AreaInfo[], chartId: string) {
  return areas.map((area) => renderArea(area, chartId));
}

// eslint-disable-next-line unused-imports/no-unused-vars
export function renderBar(bar: BarInfo, dataset: any[]) {
  return (
    <Bar
      key={bar.dataKey}
      yAxisId={bar.yAxisId ?? 'left'}
      type={bar.curveType}
      dataKey={bar.dataKey}
      name={bar.dataLabel}
      stroke={bar.color}
      fill={bar.color}
      strokeWidth={1}
      stackId={bar.stackId}
      radius={bar.radius}
      barSize={bar.barSize}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderBars(bars: BarInfo[], dataset: any[]) {
  return bars.map((bar) => renderBar(bar, dataset));
}

import { tokens } from '@fluentui/react-components';
import {
  AreaInfo,
  BarInfo,
  LineInfo,
  XAxis,
  YAxis,
} from '@headless-adminapp/core/experience/insights';
import {
  Area,
  Bar,
  CartesianGrid,
  Line,
  XAxis as XAxisInternal,
  YAxis as YAxisInternal,
} from 'recharts';

import { createAxisFormatter } from './formatters';

export function renderXAxis(axis: XAxis, forceCategory = false) {
  const xAxisFormatter = createAxisFormatter(axis.tick);

  return (
    <XAxisInternal
      dataKey={axis.dataKey}
      name={axis.name}
      tickFormatter={xAxisFormatter}
      tickLine={false}
      minTickGap={10}
      // padding={{ left: 10, right: 10 }}
      padding="gap"
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

export function renderYAxis(axis: YAxis) {
  const yAxisFormatter = createAxisFormatter(axis.tick);

  return (
    <YAxisInternal
      yAxisId="left"
      dataKey={axis.dataKey}
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
export function renderLine(line: LineInfo, dataset: any[]) {
  return (
    <Line
      key={line.dataKey}
      yAxisId={'left'}
      type={line.curveType}
      data={dataset[line.dataIndex ?? 0]}
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
export function renderLines(lines: LineInfo[], dataset: any[]) {
  return lines.map((line) => renderLine(line, dataset));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function renderArea(area: AreaInfo, dataset: any[]) {
  return (
    <Area
      key={area.dataKey}
      yAxisId={'left'}
      type={area.curveType}
      dataKey={area.dataKey}
      name={area.dataLabel}
      stroke={area.color}
      fill={area.color}
      strokeWidth={1}
      dot={false}
      activeDot={{
        stroke: area.color,
      }}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderAreas(areas: AreaInfo[], dataset: any[]) {
  return areas.map((area) => renderArea(area, dataset));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function renderBar(bar: BarInfo, dataset: any[]) {
  return (
    <Bar
      key={bar.dataKey}
      yAxisId={'left'}
      type={bar.curveType}
      dataKey={bar.dataKey}
      name={bar.dataLabel}
      stroke={bar.color}
      fill={bar.color}
      strokeWidth={1}
      stackId={bar.stackId}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderBars(bars: BarInfo[], dataset: any[]) {
  return bars.map((bar) => renderBar(bar, dataset));
}

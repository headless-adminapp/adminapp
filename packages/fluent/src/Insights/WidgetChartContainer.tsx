import { tokens } from '@fluentui/react-components';
import {
  ChartInfo,
  ChartWidgetExperience,
} from '@headless-adminapp/core/experience/insights';
import { FC, JSX } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { AreaChart } from './charts/AreaChart';
import { BarChart } from './charts/BarChart';
import { ComposedChart } from './charts/ComposedChart';
import { FunnelChart } from './charts/FunnelChart';
import { GaugeChart } from './charts/GaugeChart';
import { LineChart } from './charts/LineChart';
import { OhlcChart } from './charts/OhlcChart';
import { PieChart } from './charts/PieChart';
import { RadarChart } from './charts/RadarChart';
import { ScatterChart } from './charts/ScatterChart';
import { useWidgetDetail } from './hooks/useWidgetDetail';
import { WidgetTitleBar } from './WidgetTitleBar';

export type ChartComponentProps = {
  dataset: any[];
  chartInfo: any;
};

function getChartComponent(
  chart: ChartInfo
): ((props: ChartComponentProps) => JSX.Element) | null {
  const type = chart.type;
  switch (type) {
    case 'line':
      return LineChart;
    case 'area':
      return AreaChart;
    case 'bar':
      return BarChart;
    case 'composed':
      return ComposedChart;
    case 'scatter':
      return ScatterChart;
    case 'pie':
      return PieChart;
    case 'radar':
      return RadarChart;
    case 'gauge':
      return GaugeChart;
    case 'ohlc':
      return OhlcChart;
    case 'funnel':
      return FunnelChart;
    case 'custom':
      return chart.Component as unknown as (
        props: ChartComponentProps
      ) => JSX.Element;
    default:
      return null;
  }
}

interface WidgetChartContainerProps {
  content: ChartWidgetExperience;
}

export const WidgetChartContainer: FC<WidgetChartContainerProps> = (props) => {
  const { transformedCommands, dataset, isPending, isFetching, widget } =
    useWidgetDetail<ChartWidgetExperience>(props.content);

  const chart = props.content.chart;
  const ChartComponent = getChartComponent(chart);

  if (!ChartComponent) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow2,
        borderRadius: tokens.borderRadiusMedium,
        flexDirection: 'column',
      }}
    >
      <WidgetTitleBar title={widget.title} commands={transformedCommands} />
      <div style={{ flex: 1, position: 'relative' }}>
        {!isPending && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <ChartComponent dataset={dataset} chartInfo={chart} />
          </div>
        )}
        <BodyLoading loading={isFetching} />
      </div>
    </div>
  );
};

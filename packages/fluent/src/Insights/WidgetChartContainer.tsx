import { CommandItemState } from '@headless-adminapp/app/command';
import { ChartInfo } from '@headless-adminapp/core/experience/insights';
import {
  FC,
  JSX,
  lazy,
  LazyExoticComponent,
  PropsWithChildren,
  ReactNode,
  Suspense,
} from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { ComponentErrorBoundary } from '../components/ComponentErrorBoundary';
import { WidgetSection } from './WidgetSection';
import { WidgetTitleBar } from './WidgetTitleBar';

const AreaChart = lazy(() => import('./charts/AreaChart'));
const BarChart = lazy(() => import('./charts/BarChart'));
const ComposedChart = lazy(() => import('./charts/ComposedChart'));
const FunnelChart = lazy(() => import('./charts/FunnelChart'));
const GaugeChart = lazy(() => import('./charts/GaugeChart'));
const LineChart = lazy(() => import('./charts/LineChart'));
const OhlcChart = lazy(() => import('./charts/OhlcChart'));
const PieChart = lazy(() => import('./charts/PieChart'));
const RadarChart = lazy(() => import('./charts/RadarChart'));
const ScatterChart = lazy(() => import('./charts/ScatterChart'));

export type ChartComponentProps = {
  dataset: any[];
  chartInfo: any;
};

function getChartComponent(
  chart: ChartInfo
): LazyExoticComponent<(props: ChartComponentProps) => JSX.Element> {
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
    default:
      throw new Error(`Unsupported chart type: ${type}`);
  }
}

interface WidgetChartContainerProps {
  title: string;
  subtitle?: string;
  commands?: CommandItemState[][];
  dataset: any[];
  chartInfo: ChartInfo;
  isPending?: boolean;
  isFetching?: boolean;
  rightContent?: ReactNode;
}

export const WidgetChart: FC<WidgetChartContainerProps> = (props) => {
  return (
    <WidgetSection>
      <WidgetTitleBar
        title={props.title}
        subtitle={props.subtitle}
        commands={props.commands}
        rightContent={props.rightContent}
      />
      <WidgetChartBody
        dataset={props.dataset}
        chartInfo={props.chartInfo}
        isFetching={props.isFetching}
        isPending={props.isPending}
      />
    </WidgetSection>
  );
};

interface Props {
  isFetching?: boolean;
  isPending?: boolean;
  chartInfo: ChartInfo;
  dataset: any[];
}

const WidgetChartBody: FC<PropsWithChildren<Props>> = ({
  isFetching,
  isPending,
  chartInfo,
  dataset,
}) => {
  const ChartComponent = getChartComponent(chartInfo);

  if (!ChartComponent) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
      {!isPending && (
        <ComponentErrorBoundary>
          <div style={{ position: 'absolute', inset: 0 }}>
            <Suspense fallback={<BodyLoading loading={isFetching} />}>
              <ChartComponent dataset={dataset} chartInfo={chartInfo} />
            </Suspense>
          </div>
        </ComponentErrorBoundary>
      )}
      <BodyLoading loading={isFetching} />
    </div>
  );
};

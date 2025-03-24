import { ComponentType } from 'react';

import { SchemaAttributes } from '../../schema';
import { AggregateQuery, CustomAction } from '../../transport';
import { InsightsState } from './InsightExpereince';
import { WidgetState } from './WidgetExperience';

export enum DateAxisTickFormat {
  Date = 'date', // year:month:day // 01 Jan 2024
  DateTime = 'datetime', // 01 Jan 2024 12:20
  YearMonth = 'year:month', // Jan 2024
  Month = 'month', // Jan
  Time = 'time', // hour:minute // 12:20
  Hour = 'hour', // 12
  Minute = 'minute', // 20
  Day = 'day', // day // 2
  Year = 'year', // 2024
  MonthDay = 'month:day', // 2 Jan
}

export enum DateAxisTickInterval {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type DateAxisTick = {
  type: 'time';
  format: DateAxisTickFormat;
  formatLong?: DateAxisTickFormat;
  interval?: DateAxisTickInterval;
};

export type NumberAxisTick = {
  type: 'number';
  digit?: number;
  minDigit?: number;
  maxDigit?: number;
  unit?: string;
  unitPosition?: 'left' | 'right';
  interval?: number;
};

type CurrencyAxisTick = {
  type: 'currency';
  interval?: number;
};

type WeekdayAxisTick = {
  type: 'weekday';
};

type MonthAxisTick = {
  type: 'month';
};

export type CategoryAxisTick = {
  type: 'category';
  options?: Array<{
    value: string | number;
    label: string;
  }>;
};

export type AllAxisTick =
  | NumberAxisTick
  | CurrencyAxisTick
  | DateAxisTick
  | WeekdayAxisTick
  | MonthAxisTick
  | CategoryAxisTick;

export type NumericAxisTick = NumberAxisTick | CurrencyAxisTick;

export type Axis<A> = {
  domain?: [number | 'dataMin', number | 'dataMax'];
  range?: [number, number];
  tick: A;
  dataKey?: string;
  name?: string;
};

export type XAxis = Axis<AllAxisTick>;
export type YAxis = Axis<NumericAxisTick>;
export type ZAxis = Axis<NumericAxisTick>;

export type CurveType = 'linear' | 'monotone';

export type TickInfo = NumericAxisTick & {
  dataIndex?: number;
  dataKey: string;
  dataLabel: string;
  color?: string;
};

export type LineInfo = TickInfo & {
  curveType?: CurveType;
};

export type AreaInfo = TickInfo & {
  curveType?: CurveType;
};

export interface BarInfo {
  dataIndex?: number;
  dataKey: string;
  dataType: 'number' | 'money';
  dataLabel: string;
  curveType?: CurveType;
  color?: string;
  barSize?: number;
  radius?: number;
  stackId?: string;
}

export interface LineChartInfo {
  type: 'line';
  xAxis: XAxis;
  yAxis: YAxis;
  lines: [LineInfo, ...LineInfo[]];
}

export interface AreaChartInfo {
  type: 'area';
  xAxis: XAxis;
  yAxis: YAxis;
  areas: [AreaInfo, ...AreaInfo[]];
}

export interface BarChartInfo {
  type: 'bar';
  xAxis: XAxis;
  yAxis: YAxis;
  stackOffset?: 'sign';
  bars: [BarInfo, ...BarInfo[]];
}

export interface ComposedChartInfo {
  type: 'composed';
  xAxis: XAxis;
  yAxis: YAxis;
  lines?: LineInfo[];
  bars?: BarInfo[];
  areas?: AreaInfo[];
}

export interface ScatterChartInfo {
  type: 'scatter';
  xAxis: XAxis;
  yAxis: YAxis;
  zAxis: ZAxis;
  scatters: Array<{
    dataIndex: number;
    dataKey: string;
    // tickInfo: NumericAxisTick;
    dataType: 'number' | 'money';
    dataLabel: string;
    color?: string;
  }>;
}

export interface PieChartInfo {
  type: 'pie';
  showLegend?: boolean;
  pie: Array<{
    dataIndex?: number;
    dataTick: NumericAxisTick;
    nameTick: CategoryAxisTick;
    dataKey: string;
    nameKey: string;
    colorKey?: string; // if color from data
    colors?: string[]; // override default color list
  }>;
}

export interface RadarChartInfo {
  type: 'radar';
  radar: Array<{
    dataIndex: number;
    dataTick: NumericAxisTick;
    nameTick: CategoryAxisTick;
    dataKey: string;
    nameKey: string;
    color?: string;
  }>;
}

export interface GaugeChartInfo {
  type: 'gauge';
  sections: Array<{
    name: string;
    value: number;
    color: string | [string, string];
  }>;
  needles: Array<{
    dataIndex?: number;
    dataKey: string;
    color?: string;
  }>;
  // Record<
  //   string,
  //   {
  //     dataIndex: number;
  //     attribute: ChartAttribute;
  //     info: {
  //       color: string;
  //     };
  //   }
  // >;
}

export interface OhlcChartInfo {
  type: 'ohlc';
  xAxis: XAxis;
  yAxis: YAxis;
  bars: Array<{
    dataIndex?: number;
    open: {
      dataKey: string;
      // dataType: 'number' | 'money';
      dataLabel: string;
    };
    high: {
      dataKey: string;
      // dataType: 'number' | 'money';
      dataLabel: string;
    };
    low: {
      dataKey: string;
      // dataType: 'number' | 'money';
      dataLabel: string;
    };
    close: {
      dataKey: string;
      // dataType: 'number' | 'money';
      dataLabel: string;
    };
    colors?: [string, string];
  }>;
}

export interface FunnelChartInfo {
  type: 'funnel';
  dataTick: NumericAxisTick;
  nameTick?: Omit<CategoryAxisTick, 'type'>;
  dataKey: string;
  nameKey: string;
  colorKey?: string; // if color from data
  colors?: string[]; // override default color list
}

export interface CustomChart {
  type: 'custom';
  Component: ComponentType<{
    dataset: any[];
    chartInfo: unknown;
  }>;
  extra?: unknown;
}

export type ChartInfo =
  | LineChartInfo
  | AreaChartInfo
  | BarChartInfo
  | ComposedChartInfo
  | ScatterChartInfo
  | PieChartInfo
  | RadarChartInfo
  | GaugeChartInfo
  | OhlcChartInfo
  | CustomChart
  | FunnelChartInfo;

export type DataSetItem =
  | {
      type: 'aggregateQuery';
      value: AggregateQuery;
    }
  | {
      type: 'customAction';
      value: CustomAction;
    }
  | {
      type: 'function';
      value: <
        ISA extends SchemaAttributes = SchemaAttributes,
        WSA extends SchemaAttributes = SchemaAttributes
      >(
        insightsState: InsightsState<ISA>,
        widgetState: WidgetState<WSA>
      ) => unknown;
    }
  | {
      type: 'constant';
      value: unknown;
    };

export type DataSetItemAllowFunction =
  | DataSetItem
  | (<
      ISA extends SchemaAttributes = SchemaAttributes,
      WSA extends SchemaAttributes = SchemaAttributes
    >(
      insightsState: InsightsState<ISA>,
      widgetState: WidgetState<WSA>
    ) => DataSetItem);

// import { RetriveAggregateFnOptions } from '@react-adminapp/core/data/IDataService';
import { AggregateType } from '@headless-adminapp/core/transport';
import { Data } from '@headless-adminapp/core/transport/operations';

// export interface RetriveAggregateParams
//   extends RetriveAggregateFnOptions<Record<string, unknown>> {
//   query: AggregateQuery;
// }

export interface RetriveAggregateResult<T extends Record<string, unknown>> {
  logicalName: string;
  records: Array<Data<T>>;
  count: number;
}

type Aggregate = {
  type: AggregateType;
  field: string;
  alias: string;
};

enum DateGroupByType {
  Second = 'second',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

enum NumericGroupByType {
  Interval = 'interval', // 0 => No group, 1 => integer only, 10 => 10,20,30
}

enum IntervalType {
  Number = 'number',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

type GroupBy = {
  type?: DateGroupByType | NumericGroupByType;
  field: string;
  alias: string;

  intervalType?: IntervalType;
  intervalValue?: number; // for numeric it can be less than 1
};

// type AggregateQuery = {
//   aggregates: Aggregate[];
//   groupBy: GroupBy[];
//   order?: Array<{
//     field: string;
//     order: 'asc' | 'desc';
//   }>;
//   limit?: number;
//   filter?: Filter;
// };

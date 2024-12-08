

export interface ItemInfo {
  date: number;
  amount: number;
}

interface LineChartProps<T> {
  data: T[];
}

interface Test2 {
  attributeName: string;
  label: string;
  type: 'number' | 'date(timestamp)' | 'currency';
}

// number format - decimal or currency
// number format - number of decimals
// number format - group it (K, M, B, T)

// date format - date, month, year, day, week, hour, minute, second

// number interval - 0, 1, 10, 100
// date interval - minute, hour, day, week, month, year

// count - number of items to show

// axis range - based on min and max
// axis range - fixed

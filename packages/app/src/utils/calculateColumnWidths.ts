interface ColumnWidthItem {
  width: number; // default and minimum width
  maxWidth: number; // maximum width
}

interface CalculateColumnWidthParams {
  columns: ColumnWidthItem[];
  availableWidth: number;
  gapWidth: number;
}

interface CalculateColumnWidthResult {
  columns: number[];
}

export function calculateColumnWidths(params: CalculateColumnWidthParams) {
  const { columns, availableWidth, gapWidth } = params;

  const totalGapWidth = gapWidth * (columns.length - 1);
  const remainingWidth = availableWidth - totalGapWidth;

  const widths = columns.map((column) => column.width);
  const maxWidths = columns.map((column) => column.maxWidth);

  extendValues(widths, maxWidths, remainingWidth);

  const result: CalculateColumnWidthResult = {
    columns: widths,
  };

  return result;
}

function extendValues(
  values: number[],
  maxValues: Array<number | undefined>,
  available: number
): number[] {
  do {
    const consumed = values.reduce((acc, value) => acc + value, 0);
    const remaining = available - consumed;

    if (remaining <= 0) {
      break;
    }

    const extendableTotal = values.reduce((acc, value, index) => {
      if (value <= 0) return acc;
      if (maxValues[index] && value >= maxValues[index]) return acc;

      return acc + value;
    }, 0);

    if (extendableTotal <= 0) {
      break;
    }

    const ratio = remaining / extendableTotal;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const maxValue = maxValues[i];
      if (value <= 0) continue;
      if (maxValue && value >= maxValue) continue;

      const newValue = value + value * ratio;
      values[i] = Math.min(newValue, maxValue ?? newValue);
    }
  } while (true);

  return values;
}

import { tokens } from '@fluentui/react-components';
import { PropsWithChildren } from 'react';

export function WidgetGrid({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        padding: tokens.spacingHorizontalM,
        width: '100%',
        // flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        rowGap: tokens.spacingVerticalM,
        columnGap: tokens.spacingHorizontalM,
      }}
    >
      {children}
    </div>
  );
}

export function WidgetGridItem({
  column,
  row,
  children,
}: PropsWithChildren<{
  column?: number;
  row?: number;
}>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridColumn: column ? `span ${column}` : undefined,
        gridRow: row ? `span ${row}` : undefined,
        height: row ? 100 * row + 12 * (row - 1) : 100,
      }}
    >
      {children}
    </div>
  );
}

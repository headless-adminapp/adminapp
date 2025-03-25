import { FC, PropsWithChildren, useMemo } from 'react';

import { GAP, ROW_GAP, ROW_HEIGHT } from './constants';

interface GridProps {
  column?: number;
  gap: number;
}

const Grid: FC<PropsWithChildren<GridProps>> = ({
  children,
  column = 12,
  gap,
}) => {
  const gridTemplateColumns = useMemo(
    () => Array.from({ length: column }, () => '1fr').join(' '),
    [column]
  );

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns,
        rowGap: gap,
        columnGap: gap,
      }}
    >
      {children}
    </div>
  );
};

export function WidgetGrid({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        padding: GAP,
        width: '100%',
      }}
    >
      <Grid column={12} gap={GAP}>
        {children}
      </Grid>
    </div>
  );
}

interface WidgetGridGroupProps {
  column?: number;
  row?: number;
}

export const WidgetGridGroup: FC<PropsWithChildren<WidgetGridGroupProps>> = ({
  children,
  column = 12,
  row = 1,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridColumn: column ? `span ${column}` : undefined,
        gridRow: row ? `span ${row}` : undefined,
      }}
    >
      <Grid column={column} gap={GAP}>
        {children}
      </Grid>
    </div>
  );
};

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
        height: row ? ROW_HEIGHT * row + ROW_GAP * (row - 1) : ROW_HEIGHT,
      }}
    >
      {children}
    </div>
  );
}

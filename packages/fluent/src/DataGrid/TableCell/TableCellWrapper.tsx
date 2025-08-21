import { TableCell } from '@fluentui/react-components';
import { GridContext } from '@headless-adminapp/app/datagrid';
import { CellSelectionRange } from '@headless-adminapp/app/datagrid/context';
import {
  useContextSelector,
  useContextSetValue,
} from '@headless-adminapp/app/mutable';
import { FC, PropsWithChildren, useMemo } from 'react';

import { getSelectedCellStyle, SelectionInfo } from './utils';

function isCellSelected(
  rowIndex: number,
  columnIndex: number,
  range: CellSelectionRange
) {
  if (rowIndex < 0 || columnIndex < 0) {
    return false;
  }

  const rowStart = Math.min(range.start.row, range.end.row);
  const rowEnd = Math.max(range.start.row, range.end.row);
  const columnStart = Math.min(range.start.column, range.end.column);
  const columnEnd = Math.max(range.start.column, range.end.column);

  return (
    rowStart <= rowIndex &&
    rowEnd >= rowIndex &&
    columnStart <= columnIndex &&
    columnEnd >= columnIndex
  );
}

interface TableCellWrapperProps {
  rowIndex: number;
  columnIndex: number;
  textAlignment?: 'left' | 'center' | 'right';
  width?: number;
}

export const TableCellWrapper: FC<PropsWithChildren<TableCellWrapperProps>> = ({
  children,
  rowIndex,
  columnIndex,
  textAlignment,
  width,
}) => {
  const range = useContextSelector(
    GridContext,
    (state) => state.cellSelectionRange
  );
  const setValue = useContextSetValue(GridContext);

  const selectionInfo = useMemo<SelectionInfo | undefined>(() => {
    if (!range) return;

    const isSelectedCell = isCellSelected(rowIndex, columnIndex, range);

    if (!isSelectedCell) return;

    const isLeftCellSelected = isCellSelected(rowIndex, columnIndex - 1, range);

    const isRightCellSelected = isCellSelected(
      rowIndex,
      columnIndex + 1,
      range
    );

    const isAboveCellSelected = isCellSelected(
      rowIndex - 1,
      columnIndex,
      range
    );

    const isBelowCellSelected = isCellSelected(
      rowIndex + 1,
      columnIndex,
      range
    );

    return {
      selected: isSelectedCell,
      left: !isLeftCellSelected,
      right: !isRightCellSelected,
      top: !isAboveCellSelected,
      bottom: !isBelowCellSelected,
    };
  }, [range, rowIndex, columnIndex]);

  return (
    <TableCell
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        textAlign: textAlignment ?? 'left',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width,
        minWidth: width,
        maxWidth: width,
        ...getSelectedCellStyle(selectionInfo),
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return; // Only handle left mouse button

        if (e.shiftKey && range) {
          // change end
          setValue({
            cellSelectionRange: {
              start: range.start,
              end: { row: rowIndex, column: columnIndex },
              active: true,
            },
          });
        } else {
          setValue({
            cellSelectionRange: {
              start: { row: rowIndex, column: columnIndex },
              end: { row: rowIndex, column: columnIndex },
              active: true,
            },
          });
        }
      }}
      onMouseEnter={(e) => {
        if (range?.active) {
          setValue({
            cellSelectionRange: {
              start: range.start,
              end: { row: rowIndex, column: columnIndex },
              active: true,
            },
          });
        }
      }}
    >
      {children}
    </TableCell>
  );
};

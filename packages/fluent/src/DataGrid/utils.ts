import { RefObject } from 'react';

export const adjustTableHeight = (
  tableRef: RefObject<HTMLTableElement>,
  virtualHeight: number
) => {
  if (!tableRef.current) return;

  // calculate the height for the pseudo element after the table
  const existingPseudoElement = window.getComputedStyle(
    tableRef.current,
    '::after'
  );
  const existingPseudoHeight = parseFloat(existingPseudoElement.height) || 0;
  const tableHeight = tableRef.current.clientHeight - existingPseudoHeight;
  const pseudoHeight = Math.max(virtualHeight - tableHeight, 0);
  document.documentElement.style.setProperty(
    '--pseudo-height',
    `${pseudoHeight}px`
  );
  return pseudoHeight;
};

import { GridContext } from '@headless-adminapp/app/datagrid';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { LookupAttribute } from '@headless-adminapp/core/attributes';
import { RefObject, useContext, useEffect } from 'react';

export function useDataGridKeyboardEvent(
  tableElementRef: RefObject<HTMLTableElement>
) {
  const context = useContext(GridContext);
  const locale = useLocale();
  const { schemaStore } = useMetadata();

  useEffect(() => {
    const contextValue = context.value;
    const isTableActive = function () {
      if (!tableElementRef.current) return;

      let activeElement: Element | HTMLElement | null | undefined =
        document.activeElement;

      while (activeElement && activeElement !== tableElementRef.current) {
        activeElement = activeElement?.parentElement;
      }

      return activeElement === tableElementRef.current;
    };

    const handleCopy = async (e: KeyboardEvent) => {
      const range = contextValue.current.cellSelectionRange;
      const data = contextValue.current.data;
      const gridColumns = contextValue.current.columns;
      const schema = contextValue.current.schema;
      if (!range) {
        return;
      }

      if (!isTableActive()) {
        return;
      }

      e.preventDefault();

      const startRowIndex = Math.min(range.start.row, range.end.row);
      const endRowIndex = Math.max(range.start.row, range.end.row);

      const startColumnIndex = Math.min(range.start.column, range.end.column);
      const endColumnIndex = Math.max(range.start.column, range.end.column);

      const lineItems: string[] = [];

      for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        const rowItems: string[] = [];
        for (
          let colIndex = startColumnIndex;
          colIndex <= endColumnIndex;
          colIndex++
        ) {
          const column = gridColumns[colIndex];
          let attribute = schema.attributes[column.name];
          let value = data?.records[rowIndex]?.[column.name];

          if (column.expandedKey) {
            const lookup = column.name;
            const field = column.expandedKey;
            const entity = (schema.attributes[lookup] as LookupAttribute)
              .entity;
            const lookupSchema = schemaStore.getSchema(entity);
            attribute = lookupSchema.attributes[field];
            value = data?.records[rowIndex]?.$expand?.[lookup]?.[field];
          }

          const formattedValue = getAttributeFormattedValue(
            attribute,
            value,
            locale
          );

          rowItems.push(formattedValue ?? '');
        }
        lineItems.push(rowItems.join('\t'));
      }

      await navigator.clipboard.writeText(lineItems.join('\n'));
    };

    const handleSelectAll = (e: KeyboardEvent) => {
      if (!contextValue.current.data?.records.length) {
        return;
      }

      if (!isTableActive()) {
        return;
      }

      e.preventDefault();

      context.setValue({
        cellSelectionRange: {
          start: { row: 0, column: 0 },
          end: {
            row: contextValue.current.data.records.length - 1,
            column: contextValue.current.columns.length - 1,
          },
          active: false,
        },
      });
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        await handleCopy(e);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        handleSelectAll(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tableElementRef, context, locale, schemaStore]);
}

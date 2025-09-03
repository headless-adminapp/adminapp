import { useCalculatedAttributeStore } from '@headless-adminapp/app/metadata/hooks/useCalculatedAttributeStore';
import { SectionEditableGridControl } from '@headless-adminapp/core/experience/form';
import { CalculatedAttributeInfo } from '@headless-adminapp/core/schema/CalculatedAttributeInfo';
import { FC, useEffect, useRef } from 'react';

import { EVENT_KEY_ON_FIELD_CHANGE } from '../constants';
import {
  useDataFormSchema,
  useEventManager,
  useFormInstance,
  useSelectedForm,
} from '../hooks';
import { getColumns, getControls } from './utils';

export const CalculatedField: FC = () => {
  const formInstance = useFormInstance();
  const schema = useDataFormSchema();
  const form = useSelectedForm();

  const formInstanceRef = useRef(formInstance);
  formInstanceRef.current = formInstance;

  const calculatedAttributeStore = useCalculatedAttributeStore();
  const eventManager = useEventManager();

  useEffect(() => {
    const editableGridControls = getControls(form).filter(
      (x) => x.type === 'editablegrid'
    ) as SectionEditableGridControl[];

    const formAttributeNames = getColumns(form, schema);

    const listener = (key: string) => {
      if (!calculatedAttributeStore) return;

      const values = formInstanceRef.current.getValues();

      function recalculateRecordField(item: CalculatedAttributeInfo) {
        if (!formAttributeNames.find((x) => x === item.attributeName)) {
          // If the standard control is not found, we can't recalculate
          return;
        }

        const record: Record<string, unknown> = {};

        for (const dep of item.deps) {
          record[dep] = values[dep];
        }

        const relatedRecords: Record<string, any[]> = {};

        for (const relatedDep of Object.entries(item.relatedDeps || {})) {
          const [logicalName, { associatedColumn, columns }] = relatedDep;
          relatedRecords[logicalName] = [];

          const gridControl = editableGridControls.find(
            (x) =>
              x.alias !== false &&
              x.logicalName === logicalName &&
              x.associatedAttribute === associatedColumn
          );

          if (!gridControl) {
            continue;
          }

          const gridItemValues = values[gridControl.alias as string];

          if (!gridItemValues || !Array.isArray(gridItemValues)) {
            continue;
          }

          relatedRecords[logicalName] = gridItemValues.map((item) => {
            const childRecord: Record<string, unknown> = {};

            for (const column of columns) {
              childRecord[column] = item[column];
            }

            return childRecord;
          });
        }

        const currentValue = formInstanceRef.current.getValues(
          item.attributeName
        );

        const newValue = item.handler(record, relatedRecords);

        if (currentValue !== newValue) {
          formInstanceRef.current.setValue(item.attributeName, newValue);
          eventManager.emit(
            EVENT_KEY_ON_FIELD_CHANGE,
            item.attributeName,
            newValue,
            currentValue
          );
        }
      }

      function recalculateSubGridField(
        item: CalculatedAttributeInfo,
        alias: string,
        indexStr: string
      ) {
        const record: Record<string, unknown> = {};
        for (const dep of item.deps) {
          record[dep] = values[alias][indexStr][dep];
        }

        const currentValue = formInstanceRef.current.getValues(
          `${alias}.${indexStr}.${item.attributeName}`
        );

        const newValue = item.handler(record, {});

        if (currentValue !== newValue) {
          formInstanceRef.current.setValue(
            `${alias}.${indexStr}.${item.attributeName}`,
            newValue
          );
          eventManager.emit(
            EVENT_KEY_ON_FIELD_CHANGE,
            `${alias}.${indexStr}.${item.attributeName}`,
            newValue,
            currentValue
          );
        }
      }

      if (key.includes('.')) {
        // Handle subgrid changes
        const [alias, indexStr, field] = key.split('.');

        const gridControl = editableGridControls.find((x) => x.alias === alias);

        if (!gridControl) {
          // Invalid state
          // Grid control not found
          return;
        }

        if (!field) {
          // row removed or inserted
          // Find depended controls for all attributes included in subgrid

          let items =
            calculatedAttributeStore.getCalculatedAttributeInfosByDeps(
              gridControl.logicalName,
              ...gridControl.controls.map((x) =>
                typeof x === 'string' ? x : x.attributeName
              )
            );

          // Filter out row level calculated fields
          items = items.filter(
            (x) => x.logicalName !== gridControl.logicalName
          );

          for (const item of items) {
            recalculateRecordField(item);
          }
        } else {
          const items =
            calculatedAttributeStore.getCalculatedAttributeInfosByDeps(
              gridControl.logicalName,
              field
            );

          for (const item of items) {
            if (item.logicalName === gridControl.logicalName) {
              // This is a row level calculated field

              if (Object.keys(item.relatedDeps || {}).length > 0) {
                // Grid row level calculated fields have nested related deps
                // We don't have nested subgrid so no need to handle this case
                continue;
              }

              recalculateSubGridField(item, alias, indexStr);
            } else {
              recalculateRecordField(item);
            }
          }
        }
      } else {
        // Handle standard field changes
        const items =
          calculatedAttributeStore.getCalculatedAttributeInfosByDeps(
            schema.logicalName,
            key
          );

        for (const item of items) {
          if (item.logicalName !== schema.logicalName) {
            // This item is not related to the current schema
            // In main record field we can only calculated top-level fields
            continue;
          }

          recalculateRecordField(item);
        }
      }
    };

    eventManager.on(EVENT_KEY_ON_FIELD_CHANGE, listener);

    return () => {
      eventManager.off(EVENT_KEY_ON_FIELD_CHANGE, listener);
    };
  }, [eventManager, calculatedAttributeStore, form, schema]);

  return null;
};

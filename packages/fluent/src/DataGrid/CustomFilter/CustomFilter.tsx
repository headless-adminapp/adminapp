import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  tokens,
} from '@fluentui/react-components';
import {
  useDataGridSchema,
  useGridColumnFilter,
  useGridSorting,
} from '@headless-adminapp/app/datagrid';
import { operatorOptions } from '@headless-adminapp/app/datagrid/column-filter/constants';
import { FC, Fragment, useEffect, useMemo, useState } from 'react';

import { SectionControlWrapper } from '../../DataForm/SectionControl';
import SelectControl from '../../form/controls/SelectControl';
import { getDefaultOperator } from '../GridColumnHeader/utils';
import { ColumnFilterItem } from './ColumnFilterItem';
import { Header } from './Header';

interface CustomFilterProps {
  open: boolean;
  onClose: () => void;
}

export const CustomFilter: FC<CustomFilterProps> = ({ open, onClose }) => {
  return (
    <Drawer
      open={open}
      position="end"
      size="small"
      style={{ borderLeftWidth: 0 }}
    >
      <DrawerContent onClose={onClose} />
    </Drawer>
  );
};

interface DrawerContentProps {
  onClose: () => void;
}

const DrawerContent: FC<DrawerContentProps> = ({ onClose }) => {
  const schema = useDataGridSchema();
  const [sorting, setSorting] = useGridSorting();
  const [columnFilters, , replaceColumnFilters] = useGridColumnFilter();

  const [columnFiltersInternal, setColumnFiltersInternal] =
    useState(columnFilters);
  const [sortingInternal, setSortingInternal] = useState(sorting);

  useEffect(() => {
    setColumnFiltersInternal(columnFilters);
  }, [columnFilters]);

  useEffect(() => {
    setSortingInternal(sorting);
  }, [sorting]);

  const attributeOptions = useMemo(() => {
    return Object.entries(schema.attributes).map(([key, attribute]) => ({
      value: key,
      label: attribute.label,
    }));
  }, [schema.attributes]);

  const handleAddFilter = (key: string) => {
    const attribute = schema.attributes[key];
    const defaultOperator = getDefaultOperator(undefined, attribute.type);
    const defaultValues: any[] = [];

    setColumnFiltersInternal((prev) => ({
      ...prev,
      [key]: {
        operator: defaultOperator,
        value: defaultValues,
      },
    }));
  };

  const isValid = useMemo(() => {
    const isSortingValid = sortingInternal.every((x) => x.field && x.order);

    const isColumnFilterValid = Object.entries(columnFiltersInternal).every(
      ([key, condition]) => {
        if (!condition) {
          return true;
        }

        const attribute = schema.attributes[key];

        if (!attribute) {
          return false;
        }

        const selectedOption = operatorOptions[attribute.type].find(
          (option) => option.value === condition.operator
        );

        if (!selectedOption) {
          return false;
        }

        const values: any[] = condition.value || [];

        return (
          values.filter((value) => {
            return value !== null && value !== undefined;
          }).length === selectedOption.controls.length
        );
      }
    );

    return isColumnFilterValid && isSortingValid;
  }, [columnFiltersInternal, schema, sortingInternal]);

  const handleApply = () => {
    replaceColumnFilters(columnFiltersInternal);
    setSorting(sortingInternal);
    onClose();
  };

  const handleCancel = () => {
    setColumnFiltersInternal(columnFilters);
    setSortingInternal(sorting);
    onClose();
  };

  return (
    <Fragment>
      <Header onClose={handleCancel} />
      <DrawerBody style={{ padding: tokens.spacingHorizontalM }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacingVerticalM,
          }}
        >
          <SectionControlWrapper label="Sort by" labelPosition="top">
            <SelectControl
              value={sortingInternal[0]?.field ?? null}
              onChange={(value) => {
                if (!value) {
                  return;
                }

                setSortingInternal((prev) => [
                  {
                    ...prev[0],
                    field: value,
                    order: prev[0]?.order ?? 'asc',
                  },
                ]);
              }}
              options={attributeOptions}
            />
          </SectionControlWrapper>
          <SectionControlWrapper label="Sort order" labelPosition="top">
            <SelectControl
              value={sortingInternal[0]?.order ?? null}
              onChange={(value) => {
                if (!value) {
                  return;
                }

                setSortingInternal((prev) => [
                  {
                    ...prev[0],
                    order: value,
                  },
                ]);
              }}
              options={[
                {
                  label: 'Ascending',
                  value: 'asc',
                },
                {
                  label: 'Descending',
                  value: 'desc',
                },
              ]}
            />
          </SectionControlWrapper>
          <Divider style={{ opacity: 0.2 }} />

          {Object.entries(columnFiltersInternal).map(([key, condition]) => {
            const attribute = schema.attributes[key];

            if (!condition) {
              return null;
            }

            return (
              <ColumnFilterItem
                key={key}
                attribute={attribute}
                condition={condition}
                onChange={(nextCondition) => {
                  setColumnFiltersInternal((prev) => ({
                    ...prev,
                    [key]: nextCondition,
                  }));
                }}
                onRemove={() => {
                  setColumnFiltersInternal((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                  });
                }}
              />
            );
          })}

          <div style={{ alignSelf: 'flex-start' }}>
            <SelectControl
              value={null}
              placeholder="Add filter on"
              onChange={(value) => {
                if (!value) return;
                handleAddFilter(value);
              }}
              options={attributeOptions.filter(
                (x) => !columnFiltersInternal[x.value]
              )}
            />
          </div>
        </div>
      </DrawerBody>
      <DrawerFooter
        style={{
          padding: tokens.spacingHorizontalM,
          gap: tokens.spacingHorizontalM,
        }}
      >
        <Button appearance="primary" disabled={!isValid} onClick={handleApply}>
          Apply
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DrawerFooter>
    </Fragment>
  );
};

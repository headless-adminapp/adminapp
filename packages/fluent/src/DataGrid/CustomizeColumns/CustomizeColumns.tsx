import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  tokens,
} from '@fluentui/react-components';
import {
  GridContext,
  TransformedViewColumn,
} from '@headless-adminapp/app/datagrid';
import { useGridColumns } from '@headless-adminapp/app/datagrid/hooks';
import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { Icons } from '@headless-adminapp/icons';
import update from 'immutability-helper';
import { useCallback, useMemo, useState } from 'react';

import { DndProvider } from '../../components/DndProvider';
import { usePageEntityViewStrings } from '../../PageEntityView/PageEntityViewStringContext';
import { AddColumns } from './AddColumns';
import { ColumnItem } from './ColumnItem';

interface CustomizeColumnsProps {
  readonly opened: boolean;
  readonly onClose: () => void;
  // strings?: CustomizeColumnStrings;
}

export function CustomizeColumns({ onClose, opened }: CustomizeColumnsProps) {
  const columns = useGridColumns();
  const setContextValue = useContextSetValue(GridContext);
  const [showAddColumns, setShowAddColumns] = useState(false);
  const [items, setItems] = useState(columns);
  const strings = usePageEntityViewStrings();

  const isDirty = useMemo(() => {
    return JSON.stringify(items) !== JSON.stringify(columns);
  }, [columns, items]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const onColumnAdd = useCallback((column: TransformedViewColumn) => {
    setItems((prev) => {
      if (prev.some((x) => x.id === column.id)) {
        return prev;
      }

      return [...prev, column];
    });
  }, []);

  const onColumnRemove = useCallback((column: TransformedViewColumn) => {
    setItems((prev) => prev.filter((x) => x.id !== column.id));
  }, []);

  return (
    <Drawer separator open={opened} position="end" size="small">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Icons.Close />}
              onClick={onClose}
            />
          }
        >
          {strings.editColumns}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: tokens.spacingVerticalXS,
            paddingInline: tokens.spacingHorizontalS,
          }}
        >
          <Button
            appearance="subtle"
            icon={<Icons.Add />}
            style={{
              fontWeight: tokens.fontSizeBase400,
              minWidth: 'unset',
            }}
            onClick={() => setShowAddColumns(true)}
          >
            {strings.add}
          </Button>
          <Button
            appearance="subtle"
            icon={<Icons.Edit />}
            style={{ fontWeight: tokens.fontSizeBase400, minWidth: 'unset' }}
            disabled={!isDirty}
            onClick={() => {
              setItems(columns);
            }}
          >
            {strings.reset}
          </Button>
        </div>
        <AddColumns
          onColumnAdd={onColumnAdd}
          onColumnRemove={onColumnRemove}
          columns={items}
          opened={showAddColumns}
          onClose={() => setShowAddColumns(false)}
        />
        <Divider />
      </div>
      <DrawerBody style={{ paddingInline: tokens.spacingHorizontalS }}>
        <DndProvider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: tokens.spacingVerticalS,
              // padding: tokens.spacingHorizontalS,
              paddingBlock: tokens.spacingVerticalS,
            }}
          >
            {items.map((item, index) => (
              <ColumnItem
                key={item.id}
                index={index}
                item={item}
                moveItem={moveItem}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onRemove={() => onColumnRemove(item)}
                stringSet={strings}
              />
            ))}
          </div>
        </DndProvider>
      </DrawerBody>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Divider />
        <div
          style={{
            display: 'flex',
            padding: 8,
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={() => {
              setContextValue({
                columns: items,
              });
              onClose();
            }}
            appearance="primary"
          >
            {strings.apply}
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            {strings.cancel}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

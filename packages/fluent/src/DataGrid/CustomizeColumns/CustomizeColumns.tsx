import { Drawer, DrawerBody, tokens } from '@fluentui/react-components';
import {
  GridContext,
  TransformedViewColumn,
} from '@headless-adminapp/app/datagrid';
import { useGridColumns } from '@headless-adminapp/app/datagrid/hooks';
import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { Icons } from '@headless-adminapp/icons';
import update from 'immutability-helper';
import { useCallback, useMemo, useState } from 'react';

import { CommandButton } from '../../CommandBar/Button';
import { CommandBarWrapper } from '../../CommandBar/Wrapper';
import { DndProvider } from '../../components/DndProvider';
import { DrawerFooter } from '../../components/DrawerFooter';
import { DrawerHeader } from '../../components/DrawerHeader';
import { Button } from '../../components/fluent';
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
      <DrawerHeader
        title={strings.editColumns}
        showCloseButton
        onClose={onClose}
      />
      <DrawerBody style={{ paddingInline: tokens.spacingHorizontalM }}>
        <div style={{ marginInline: -8, marginTop: 8 }}>
          <CommandBarWrapper>
            <CommandButton
              Icon={Icons.Add}
              text={strings.add}
              onClick={() => setShowAddColumns(true)}
            />
            <CommandButton
              Icon={Icons.Edit}
              text={strings.reset}
              disabled={!isDirty}
              onClick={() => {
                setItems(columns);
              }}
            />
          </CommandBarWrapper>
          <AddColumns
            onColumnAdd={onColumnAdd}
            onColumnRemove={onColumnRemove}
            columns={items}
            opened={showAddColumns}
            onClose={() => setShowAddColumns(false)}
          />
        </div>
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
      <DrawerFooter>
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
      </DrawerFooter>
    </Drawer>
  );
}

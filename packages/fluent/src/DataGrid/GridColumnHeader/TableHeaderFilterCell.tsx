import {
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  makeStyles,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  TableHeaderCell,
  tokens,
} from '@fluentui/react-components';
import { TransformedViewColumn } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridColumnFilter,
} from '@headless-adminapp/app/datagrid/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { Icons } from '@headless-adminapp/icons';
import {
  FC,
  Fragment,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from 'react';

import { usePageEntityViewStrings } from '../../PageEntityView/PageEntityViewStringContext';
import { FilterForm } from './FilterForm';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    userSelect: 'none',
    '&:active': {
      backgroundColor: tokens.colorSubtleBackgroundPressed,
    },
    '&:hover [data-id="resize-handle"]': {
      opacity: 0.5,
    },
  },
  resizeHandle: {
    position: 'absolute',
    right: '-6px',
    zIndex: 5,
    top: 0,
    bottom: 0,
    width: '12px',
    cursor: 'col-resize',
    // background: 'black',
    userSelect: 'none',
    touchAction: 'none',
    paddingBlock: '6px',
    display: 'flex',
    justifyContent: 'center',
    opacity: 0,

    '&:hover': {
      opacity: '0.8 !important',
    },
  },
  resizeHandleInner: {
    width: '2px',
    background: tokens.colorNeutralForeground1,
    // borderLeft: `1px solid ${tokens.colorNeutralForeground1}`,
    // borderRight: `1px solid ${tokens.colorNeutralForeground1}`,
  },
  right: {
    '& .fui-TableHeaderCell__button': {
      justifyContent: 'flex-end',
    },
  },
});

interface TableHeaderFilterCellProps {
  sortDirection?: 'asc' | 'desc';
  columnName: string;
  onChangeSortDirection?: (direction: 'asc' | 'desc') => void;
  filterCondition?: ColumnCondition;
  onChangeFilterCondition?: (condition: ColumnCondition | undefined) => void;
  attribute: Attribute;
  minWidth?: number;
  onChangeWidth?: (width: number) => void;
  column: TransformedViewColumn;
  onResetSize?: () => void;
  resizeHandler?: (event: unknown) => void;
  resizable?: boolean;
  disableFilter?: boolean;
  disableSort?: boolean;
}

export const TableHeaderFilterCell: FC<
  PropsWithChildren<TableHeaderFilterCellProps>
> = ({
  children,
  sortDirection,
  // onChangeFilterCondition,
  onChangeSortDirection,
  // attribute,
  // filterCondition,
  minWidth,
  // onChangeWidth,
  column,
  onResetSize,
  resizeHandler,
  resizable,
  disableFilter,
  disableSort,
}) => {
  const [visible, setVisible] = useState(false);
  const schema = useDataGridSchema();
  const { schemaStore } = useMetadata();
  const strings = usePageEntityViewStrings();

  const attribute = useMemo(() => {
    const _attribute = schema.attributes[column.name];
    if (!column.expandedKey) {
      return _attribute;
    }

    if (_attribute.type !== 'lookup') {
      throw new Error('Invalid attribute type');
    }

    const lookupSchema = schemaStore.getSchema(_attribute.entity);
    return lookupSchema.attributes[column.expandedKey];
  }, [column.expandedKey, column.name, schemaStore, schema.attributes]);

  const align = useMemo(() => {
    switch (attribute.type) {
      case 'money':
      case 'number':
        return 'right';
      default:
        return 'left';
    }
  }, [attribute.type]);

  const styles = useStyles();

  const isResizingRef = useRef(false);

  const [columnFilters, setColumnFilters] = useGridColumnFilter();

  const filterCondition = columnFilters[column.id];

  const onChangeFilterCondition = (condition: ColumnCondition | undefined) => {
    setColumnFilters(column.id, condition);
  };

  const sortMenuItems = (
    <>
      <MenuItem
        icon={<Icons.ArrowUp size={16} />}
        onClick={() => onChangeSortDirection?.('asc')}
      >
        {strings.sortByAscending}
      </MenuItem>
      <MenuItem
        icon={<Icons.ArrowDown size={16} />}
        onClick={() => onChangeSortDirection?.('desc')}
      >
        {strings.sortByDescending}
      </MenuItem>
    </>
  );

  const filterMenuItems = (
    <>
      <MenuItem
        icon={<Icons.Filter size={16} />}
        onClick={() => setVisible(!visible)}
      >
        {strings.filter}
      </MenuItem>
      {!!filterCondition && (
        <MenuItem
          icon={<Icons.FilterDismiss size={16} />}
          onClick={() => {
            onChangeFilterCondition(undefined);
          }}
        >
          {strings.clearFilter}
        </MenuItem>
      )}
    </>
  );

  const menuItems = [];

  if (!disableSort) {
    menuItems.push(sortMenuItems);
  }

  if (!disableFilter) {
    menuItems.push(filterMenuItems);
  }

  const headerCell = (
    <TableHeaderCell
      as="div"
      className={mergeClasses(styles.root, align === 'right' && styles.right)}
      style={{
        textAlign: align,
        width: minWidth,
        minWidth: minWidth,
        maxWidth: minWidth,
        display: 'flex',
        alignItems: 'center',
        fontWeight: tokens.fontWeightMedium,
        // pointerEvents: disableFilter && disableSort ? 'none' : 'auto',
        height: '100%',
      }}
      onClick={(event) => {
        event.preventDefault();
      }}
      aside={
        resizable ? (
          <div
            className={mergeClasses(styles.resizeHandle)}
            data-id="resize-handle"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              onResetSize?.();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
              resizeHandler?.(event);
            }}
            onMouseUp={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onTouchStart={(event) => {
              event.stopPropagation();
              event.preventDefault();
              resizeHandler?.(event);
            }}
          >
            <div className={mergeClasses(styles.resizeHandleInner)} />
          </div>
        ) : null
      }
      onMouseUp={(event) => {
        event.preventDefault();
        if (isResizingRef.current) {
          return;
        }

        isResizingRef.current = false;
      }}
      sortable={!disableSort}
      // sortDirection="ascending"
      sortDirection={getSortDirection(sortDirection)}
    >
      {children}
      {!!filterCondition && (
        <div style={{ marginTop: 2, color: tokens.colorNeutralForeground1 }}>
          <Icons.Filter size={16} />
        </div>
      )}
    </TableHeaderCell>
  );

  if (disableFilter && disableSort) {
    return headerCell;
  }

  const menuPosition = align === 'right' ? 'below-end' : 'below-start';

  return (
    <th>
      <Menu positioning={menuPosition}>
        <MenuTrigger>{headerCell}</MenuTrigger>
        <MenuPopover>
          <MenuList>
            {menuItems.map((x, i) => (
              <Fragment key={i}>
                {i > 0 && <MenuDivider />}
                {x}
              </Fragment>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
      <Dialog open={visible} onOpenChange={() => setVisible(false)}>
        <DialogSurface style={{ maxWidth: 400 }}>
          <DialogBody>
            <DialogTitle>{strings.filterBy}</DialogTitle>
            <FilterForm
              attribute={attribute}
              defaultValue={filterCondition}
              onApply={(condition) => {
                onChangeFilterCondition(condition);
                setVisible(false);
              }}
              onCancel={() => setVisible(false)}
            />
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </th>
  );
};

const getSortDirection = (direction?: 'asc' | 'desc') => {
  if (direction === 'asc') {
    return 'ascending';
  } else if (direction === 'desc') {
    return 'descending';
  } else {
    return undefined;
  }
};

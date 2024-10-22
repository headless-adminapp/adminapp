import {
  Button,
  makeStyles,
  Menu,
  MenuPopover,
  MenuTrigger,
  TableCell,
  tokens,
} from '@fluentui/react-components';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { MenuItemProps } from '../../CommandBar/MenuItem';
import { MenuList } from '../../CommandBar/MenuList';

const useStyles = makeStyles({
  button: {
    '&:hover': {
      background: tokens.colorNeutralBackground5,
    },
  },
});

export interface TableCellActionProps {
  items: ArrayGroupWithAtLeastOne<MenuItemProps>;
  onOpen?: () => void;
}

export const TableCellAction: FC<TableCellActionProps> = ({
  items,
  onOpen,
}) => {
  const styles = useStyles();

  return (
    <TableCell
      className="tableCellAction"
      style={{
        display: 'flex',
        padding: 0,
        // width: 32,
        minWidth: 32,
        // maxWidth: 32,
        flex: 1,
        flexShrink: 0,
        position: 'sticky',
        right: 0,
        // top: 0,
        zIndex: 1,
        justifyContent: 'right',
        // background: 'white',
        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
      }}
    >
      <Menu positioning="before-top">
        <MenuTrigger>
          <Button
            appearance="transparent"
            icon={<Icons.MoreVertical />}
            onClick={onOpen}
            className={styles.button}
            style={{
              // background: 'white',
              // boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              boxShadow: 'var(--action-shadow)',
              borderRadius: 0,
              // background: tokens.colorNeutralBackground1,
            }}
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList items={items} />
        </MenuPopover>
      </Menu>
    </TableCell>
  );
};

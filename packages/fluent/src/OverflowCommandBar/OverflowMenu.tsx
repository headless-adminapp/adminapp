import {
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
  ToolbarButton,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Icons } from '@headless-adminapp/icons';
import { Fragment } from 'react';

import { MenuItem, MenuItemProps } from '../CommandBar/MenuItem';
import { OverflowMenuDivider } from './OverflowMenuDivider';
import { transformMenuItems } from './utils';

export const OverflowMenu: React.FC<{ items: CommandItemState[][] }> = ({
  items,
}) => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();
  const { language } = useLocale();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu positioning="below-end" hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <ToolbarButton
          ref={ref}
          type="button"
          icon={<Icons.MoreHorizontal />}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {items.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              {groupIndex > 0 && (
                <OverflowMenuDivider
                  id={String(groupIndex)}
                  previousGroupId={String(groupIndex - 1)}
                />
              )}
              {group.map((item, index) => {
                const text = 'text' in item ? item.text ?? '' : '';
                return (
                  <OverflowMenuItem
                    key={`${groupIndex}-${index}`}
                    id={`${groupIndex}-${index}`}
                    Icon={item.Icon}
                    onClick={item.type !== 'label' ? item.onClick : undefined}
                    text={text}
                    danger={item.danger}
                    disabled={item.type !== 'label' ? item.disabled : undefined}
                    items={
                      item.type === 'menu'
                        ? (item.items?.map((x) =>
                            transformMenuItems(x, language)
                          ) as ArrayGroupWithAtLeastOne<MenuItemProps>)
                        : undefined
                    }
                  />
                );
              })}
            </Fragment>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const OverflowMenuItem: React.FC<MenuItemProps & { id: string }> = (props) => {
  const { id, ...rest } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return <MenuItem {...rest} />;
};

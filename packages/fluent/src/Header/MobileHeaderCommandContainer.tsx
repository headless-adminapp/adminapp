import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  makeStyles,
  MenuDivider,
  MenuItem,
  MenuList,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import {
  CommandItemState,
  MenuItemCommandState,
} from '@headless-adminapp/app/command';
import { MobileHeaderRightContent } from '@headless-adminapp/app/header/components/MobileHeaderRightContent';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Icon, IconPlaceholder, Icons } from '@headless-adminapp/icons';
import { FC, Fragment, useEffect, useMemo, useState } from 'react';

import { QuickActionItem } from '../App/QuickActionItem';
import { MobileHeaderQuickActionButton } from './MobileHeaderQuickActionButton';

const useStyles = makeStyles({
  dangerMenuItem: {
    color: tokens.colorStatusDangerForeground1,
    '&:hover': {
      backgroundColor: tokens.colorStatusDangerBackground3Hover,
    },
    '&:active': {
      backgroundColor: tokens.colorStatusDangerBackground3Pressed,
    },
  },
});

function isQuickAction(command: CommandItemState) {
  if (command.type === 'button') {
    return command.isQuickAction ?? false;
  }

  return false;
}

interface MobileHeaderCommandContainerProps {
  commands: CommandItemState[][];
}

export const MobileHeaderCommandContainer: FC<
  MobileHeaderCommandContainerProps
> = ({ commands }) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const quickActions = useMemo(() => {
    return commands.flat().filter((command) => isQuickAction(command));
  }, [commands]);

  const moreActions: CommandItemState[][] = useMemo(() => {
    return commands
      .map((group) => {
        return group.filter((command) => {
          if (isQuickAction(command)) {
            return false;
          }

          if (command.type === 'icon') {
            return false;
          }

          return true;
        });
      })
      .filter((group) => group.length > 0);
  }, [commands]);

  return (
    <MobileHeaderRightContent>
      <div
        style={{
          paddingLeft: 8,
          display: 'flex',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {quickActions.map((command, index) => {
            if (command.hidden || command.type !== 'button') {
              return null;
            }

            return (
              <MobileHeaderQuickActionButton
                key={index}
                title={command.text}
                Icon={command.Icon}
                onClick={command.onClick}
              />
            );
          })}
          {moreActions.length > 0 && (
            <QuickActionItem
              Icon={Icons.MoreVertical}
              label="More Actions"
              onClick={() => setShowMoreActions(true)}
            />
          )}
        </div>
      </div>
      <BottomDrawerMenu
        open={showMoreActions}
        onClose={() => setShowMoreActions(false)}
        actions={moreActions}
      />
    </MobileHeaderRightContent>
  );
};

interface BottomDrawerMenuProps {
  open: boolean;
  onClose: () => void;
  actions: CommandItemState[][];
}

export const BottomDrawerMenu: FC<BottomDrawerMenuProps> = ({
  open,
  onClose,
  actions,
}) => {
  const [subMenuStack, setSubMenuStack] = useState<
    ArrayGroupWithAtLeastOne<MenuItemCommandState>[]
  >([]);

  useEffect(() => {
    setSubMenuStack([]);
  }, [open]);

  const pushStack = (items: ArrayGroupWithAtLeastOne<MenuItemCommandState>) => {
    setSubMenuStack((prev) => [items, ...prev]);
  };

  const popStack = () => {
    setSubMenuStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(1);
      }
      return [];
    });
  };

  return (
    <Drawer
      separator
      open={open}
      position="bottom"
      size="small"
      style={{
        borderTopLeftRadius: tokens.borderRadiusXLarge,
        borderTopRightRadius: tokens.borderRadiusXLarge,
        height: 'unset',
      }}
      onOpenChange={() => {
        if (!subMenuStack.length) {
          onClose();
        }
      }}
    >
      <DrawerBody
        style={{
          maxHeight: '70vh',
          padding: 0,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            paddingInline: tokens.spacingHorizontalM,
            paddingBlock: tokens.spacingVerticalS,
            boxShadow: tokens.shadow2,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {subMenuStack.length ? (
            <Button
              icon={<Icons.ChevronLeft size={20} />}
              appearance="subtle"
              onClick={popStack}
            />
          ) : (
            <div />
          )}
          {!subMenuStack.length && (
            <Button
              icon={<Icons.Close size={20} />}
              appearance="subtle"
              onClick={onClose}
            />
          )}
        </div>
        <div
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {!subMenuStack.length && (
            <MenuList hasIcons style={{ gap: 0 }}>
              {actions.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                  {groupIndex > 0 && (
                    <MenuDivider style={{ opacity: 0.2, margin: '0px 5px' }} />
                  )}
                  {group.map((item, index) => {
                    if (item.hidden) {
                      return null;
                    }

                    if (item.type === 'button') {
                      return (
                        <ButtonItem
                          key={`${groupIndex}-${index}`}
                          text={item.text}
                          Icon={item.Icon}
                          danger={item.danger}
                          onClick={() => {
                            onClose();
                            item.onClick?.();
                          }}
                        />
                      );
                    }

                    if (item.type === 'menu') {
                      return (
                        <NavigationMenu
                          key={`${groupIndex}-${index}`}
                          text={item.text}
                          Icon={item.Icon}
                          danger={item.danger}
                          showDivider={item.items.length > 0 && !!item.onClick}
                          showNavigateButton={item.items.length > 0}
                          onNavigate={() => {
                            pushStack(item.items);
                          }}
                          onClick={() => {
                            if (item.onClick) {
                              onClose();
                              item.onClick();
                            } else {
                              pushStack(item.items);
                            }
                          }}
                        />
                      );
                    }
                  })}
                </Fragment>
              ))}
            </MenuList>
          )}
          {subMenuStack.length > 0 && (
            <MenuList hasIcons style={{ gap: 0 }}>
              {subMenuStack[0].map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                  {groupIndex > 0 && (
                    <MenuDivider style={{ opacity: 0.2, margin: '0px 5px' }} />
                  )}
                  {group.map((item, index) => {
                    if (item.hidden) {
                      return null;
                    }

                    return (
                      <NavigationMenu
                        key={`${groupIndex}-${index}`}
                        text={item.text}
                        Icon={item.Icon}
                        danger={item.danger}
                        showDivider={!!item.items?.length && !!item.onClick}
                        showNavigateButton={!!item.items?.length}
                        onNavigate={() => {
                          if (!item.items?.length) {
                            return;
                          }

                          pushStack(item.items);
                        }}
                        onClick={() => {
                          if (item.onClick) {
                            onClose();
                            item.onClick();
                          } else if (item.items?.length) {
                            pushStack(item.items);
                          }
                        }}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </MenuList>
          )}
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </DrawerBody>
    </Drawer>
  );
};

interface MenuItem2Props {
  Icon?: Icon;
  danger?: boolean;
  text: string;
  onClick?: () => void;
  onNavigate?: () => void;
  showDivider?: boolean;
  showNavigateButton?: boolean;
}

const NavigationMenu: FC<MenuItem2Props> = ({
  Icon,
  danger,
  text,
  onClick,
  onNavigate,
  showDivider,
  showNavigateButton,
}) => {
  const styles = useStyles();

  return (
    <MenuItem
      icon={Icon ? <Icon size={20} /> : <IconPlaceholder size={20} />}
      className={mergeClasses(danger && styles.dangerMenuItem)}
      style={{
        maxWidth: 'unset',
        minHeight: 48,
        alignItems: 'center',
        paddingInline: tokens.spacingHorizontalM,
      }}
      onClick={() => {
        onClick?.();
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ flex: 1 }}>{text}</span>
        {showNavigateButton && showDivider && (
          <div>
            <Divider vertical style={{ opacity: 0.5, height: '100%' }} />
          </div>
        )}
        {showNavigateButton && (
          <Button
            icon={<Icons.ChevronRight size={20} />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.();
            }}
            appearance="subtle"
          />
        )}
      </div>
    </MenuItem>
  );
};

interface ButtonItemProps {
  Icon?: Icon;
  danger?: boolean;
  text: string;
  onClick?: () => void;
}

const ButtonItem: FC<ButtonItemProps> = ({ Icon, danger, text, onClick }) => {
  const styles = useStyles();

  return (
    <MenuItem
      icon={Icon ? <Icon size={20} /> : <IconPlaceholder size={20} />}
      className={mergeClasses(danger && styles.dangerMenuItem)}
      style={{
        maxWidth: 'unset',
        minHeight: 48,
        alignItems: 'center',
        paddingInline: tokens.spacingHorizontalM,
      }}
      onClick={onClick}
    >
      {text}
    </MenuItem>
  );
};

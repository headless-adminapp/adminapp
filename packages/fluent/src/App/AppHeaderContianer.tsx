import {
  Avatar,
  Caption1,
  Caption1Strong,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { useAppContext } from '@headless-adminapp/app/app';
import { useAuthSession, useLogout } from '@headless-adminapp/app/auth/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import { FC, useMemo } from 'react';

import { AppLogo } from './AppLogo';
import { useAppStrings } from './AppStringContext';
import { QuickActionItem } from './QuickActionItem';

export const AppHeaderContainer: FC = () => {
  const { app } = useAppContext();
  const authSession = useAuthSession();
  const logout = useLogout();
  const strings = useAppStrings();
  const { language } = useLocale();

  const initials = useMemo(() => {
    return authSession?.fullName
      .split(' ')
      .map((item) => item[0])
      .slice(0, 2)
      .join('');
  }, [authSession?.fullName]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 50,
        minHeight: 50,
        background: tokens.colorBrandBackground,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 20,
          paddingRight: 8,
          cursor: 'pointer',
          color: 'white',
        }}
      >
        <AppLogo logo={app.logo} title={app.title} />
        <Subtitle2>{app.title}</Subtitle2>
      </div>
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          display: 'flex',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {app.quickActionItems?.map((item, index) => {
            return (
              <QuickActionItem
                key={index}
                Icon={item.icon}
                label={item.localizedLabel?.[language] ?? item.label}
                onClick={() => item.onClick?.()}
                link={item.link}
              />
            );
          })}
        </div>
        <Popover>
          <PopoverTrigger disableButtonEnhancement>
            <Avatar
              initials={initials}
              color="neutral"
              style={{ cursor: 'pointer' }}
              image={{
                src: authSession?.profilePicture,
              }}
            />
          </PopoverTrigger>
          <PopoverSurface tabIndex={-1} style={{ padding: 0 }}>
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: 8,
                overflow: 'hidden',
                width: 200,
              }}
            >
              <div>
                <Avatar
                  initials={initials}
                  color="neutral"
                  image={{
                    src: authSession?.profilePicture,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                <Caption1Strong>{authSession?.fullName}</Caption1Strong>
                <Caption1
                  style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {authSession?.email}
                </Caption1>
              </div>
            </div>
            <MenuDivider style={{ marginInline: 0 }} />
            <MenuList style={{ width: 200, marginBottom: 4 }}>
              {app.accountMenuItems?.map((item, index) => {
                const Icon = item.icon;

                return (
                  <MenuItem
                    key={index}
                    icon={<Icon />}
                    onClick={() => item.onClick?.()}
                  >
                    {item.localizedLabel?.[language] ?? item.label}
                  </MenuItem>
                );
              })}
              <MenuItem icon={<Icons.SignOut />} onClick={() => logout()}>
                {strings.logout}
              </MenuItem>
            </MenuList>
          </PopoverSurface>
        </Popover>
      </div>
    </div>
  );
};

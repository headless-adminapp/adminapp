import {
  Avatar,
  Caption1,
  Caption1Strong,
  Hamburger,
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
import { useIsSkipAuthCheck } from '@headless-adminapp/app/auth/hooks/useIsSkipAuthCheck';
import { HeaderContext, useHeaderValue } from '@headless-adminapp/app/header';
import {
  useIsMobile,
  useIsTablet,
  useItemsWithKey,
} from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useBasePath, useRouter } from '@headless-adminapp/app/route';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import { Icons } from '@headless-adminapp/icons';
import { FC, ReactNode, useMemo, useState } from 'react';

import { AppLogo } from './AppLogo';
import { useAppStrings } from './AppStringContext';
import { QuickActionItem } from './QuickActionItem';

interface AppHeaderContainerProps {
  onNavToggle?: () => void;
}

export const AppHeaderContainer: FC<AppHeaderContainerProps> = ({
  onNavToggle,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <AppMobileHeader onNavToggle={onNavToggle} />;
  }

  return <AppDesktopHeader onNavToggle={onNavToggle} />;
};

interface NavHamburgerProps {
  onNavToggle?: () => void;
}

const NavHamburger: FC<NavHamburgerProps> = ({ onNavToggle }) => {
  const isMobile = useIsMobile();

  return (
    <Hamburger
      style={{
        color: 'inherit',
        width: !isMobile ? 44 : undefined,
        maxWidth: !isMobile ? 44 : undefined,
      }}
      onClick={onNavToggle}
    />
  );
};

const NavBackButton: FC = () => {
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <Hamburger
      style={{
        color: 'inherit',
        width: !isMobile ? 44 : undefined,
        maxWidth: !isMobile ? 44 : undefined,
      }}
      icon={<Icons.ArrowLeft />}
      onClick={async () => {
        await router.back();
      }}
    />
  );
};

const NavTitle: FC = () => {
  const { appExperience: app } = useAppContext();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', paddingLeft: 4, paddingRight: 6 }}>
        <AppLogo logo={app.logo} title={app.title} />
      </div>
      <Subtitle2 style={{ paddingLeft: 4 }}>{app.title}</Subtitle2>
    </div>
  );
};

const NavActions: FC = () => {
  const { appExperience: app } = useAppContext();
  const authSession = useAuthSession();
  const isSkipAuthCheck = useIsSkipAuthCheck();
  const logout = useLogout();
  const strings = useAppStrings();
  const { language } = useLocale();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const initials = useMemo(() => {
    return authSession?.fullName
      .toUpperCase()
      .split(' ')
      .map((item) => item[0])
      .slice(0, 2)
      .join('');
  }, [authSession?.fullName]);

  const quickActionItems = useItemsWithKey(app.quickActionItems);
  const accountMenuItems = useItemsWithKey(app.accountMenuItems);
  const router = useRouter();
  const basePath = useBasePath();

  return (
    <div
      style={{
        paddingLeft: 8,
        display: 'flex',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        {quickActionItems?.map((item) => {
          if (item.type === 'custom') {
            return <item.Component key={item.__key} />;
          }

          return (
            <QuickActionItem
              key={item.__key}
              Icon={item.icon}
              label={item.localizedLabel?.[language] ?? item.label}
              onClick={() => item.onClick?.()}
              link={item.link}
            />
          );
        })}
      </div>
      {(!isSkipAuthCheck || !!accountMenuItems?.length) && (
        <Popover
          open={accountMenuOpen}
          onOpenChange={(e, data) => setAccountMenuOpen(data.open)}
        >
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
            {!isSkipAuthCheck && (
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
            )}
            {!isSkipAuthCheck && <MenuDivider style={{ marginInline: 0 }} />}
            <MenuList style={{ width: 200, marginBottom: 4 }}>
              {accountMenuItems?.map((item) => {
                const Icon = item.icon;

                return (
                  <MenuItem
                    key={item.__key}
                    icon={<Icon size="inherit" />}
                    onClick={async () => {
                      setAccountMenuOpen(false);
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.link) {
                        await router.push(basePath + item.link);
                      }
                    }}
                  >
                    {item.localizedLabel?.[language] ?? item.label}
                  </MenuItem>
                );
              })}
              {!isSkipAuthCheck && (
                <MenuItem icon={<Icons.SignOut />} onClick={() => logout()}>
                  {strings.logout}
                </MenuItem>
              )}
            </MenuList>
          </PopoverSurface>
        </Popover>
      )}
    </div>
  );
};

const AppDesktopHeader: FC<AppHeaderContainerProps> = ({ onNavToggle }) => {
  const isTablet = useIsTablet();
  const { appExperience: app } = useAppContext();
  const background = app.headerColor ?? tokens.colorBrandBackground;

  const color = useMemo(() => {
    if (!background) {
      return;
    }

    return isColorDark(background) ? '#FFFFFF' : '#000000';
  }, [background]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 50,
        minHeight: 50,
        background,
        paddingInline: 8,
        gap: 8,
        color,
      }}
    >
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}>
        {isTablet && <NavHamburger onNavToggle={onNavToggle} />}
        <NavTitle />
      </div>
      <NavActions />
    </div>
  );
};

const AppMobileHeader: FC<AppHeaderContainerProps> = ({ onNavToggle }) => {
  const showCustomHeader = useContextSelector(
    HeaderContext,
    (state) => state.showBackButton.length > 0
  );
  const { appExperience: app } = useAppContext();
  const headerTitle = useHeaderValue<ReactNode>('title');
  const rightComponent = useHeaderValue<ReactNode>('rightComponent');
  const showBackButton = useHeaderValue<boolean>('showBackButton');

  const background = app.headerColor ?? tokens.colorBrandBackground;

  const color = useMemo(() => {
    if (!background) {
      return;
    }

    return isColorDark(background) ? '#FFFFFF' : '#000000';
  }, [background]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 50,
        minHeight: 50,
        background,
        paddingInline: 8,
        gap: 8,
        color,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        {showBackButton ? (
          <NavBackButton />
        ) : (
          <NavHamburger onNavToggle={onNavToggle} />
        )}
        {showCustomHeader ? (
          <>
            {typeof headerTitle === 'string' ? (
              <Subtitle2
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                {headerTitle}
              </Subtitle2>
            ) : (
              headerTitle
            )}
          </>
        ) : (
          <NavTitle />
        )}
      </div>
      {showCustomHeader ? rightComponent : <NavActions />}
    </div>
  );
};

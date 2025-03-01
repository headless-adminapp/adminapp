import { DrawerProps, makeStyles, tokens } from '@fluentui/react-components';
import {
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSectionHeader,
} from '@fluentui/react-nav-preview';
import { useAppContext } from '@headless-adminapp/app/app';
import { useLocale } from '@headless-adminapp/app/locale';
import {
  useIsRouteActive,
  usePathname,
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { NavPageItem } from '@headless-adminapp/core/experience/app';
import { IconPlaceholder, Icons } from '@headless-adminapp/icons';
import { FC, Fragment } from 'react';

import { transformNavPageItem } from './utils';

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    display: 'flex',
    flexShrink: 0,
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalS,
  },
});

type DrawerType = Required<DrawerProps>['type'];

interface NavigationContainerProps {
  open: boolean;
  type: DrawerType;
  onOpenChange: (open: boolean) => void;
}

export const NavigationContainer: FC<NavigationContainerProps> = ({
  open,
  type,
  onOpenChange,
}) => {
  const styles = useStyles();
  const { appExperience: app } = useAppContext();

  return (
    <div className={styles.root}>
      <NavDrawer
        selectedValue="active"
        open={open}
        type={type}
        onOpenChange={(value, data) => onOpenChange(data.open)}
      >
        <NavDrawerBody style={{ paddingTop: 8 }}>
          {app.navItems.map((area) => (
            <Fragment key={area.label}>
              {area.groups.map((group) => (
                <Fragment key={group.label}>
                  {!group.hideLabel && (
                    <NavSectionHeader>{group.label}</NavSectionHeader>
                  )}
                  {group.items.map((item, index) => (
                    <Test
                      key={(item.label ?? '') + String(index)}
                      item={item}
                      drawerType={type}
                      onOpenChange={onOpenChange}
                    />
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};

interface TestProps {
  item: NavPageItem;
  drawerType: DrawerType;
  onOpenChange: (open: boolean) => void;
}

const Test: FC<TestProps> = ({ item, onOpenChange, drawerType }) => {
  const { schemaMetadataDic } = useAppContext();

  const router = useRouter();
  const pathname = usePathname();

  const selectedPath = pathname;
  const { language } = useLocale();

  const isRouteActive = useIsRouteActive();
  const routeResolver = useRouteResolver();

  const navItem = transformNavPageItem({
    item,
    schemaMetadataDic: schemaMetadataDic,
    language,
    routeResolver,
  });

  const Icon = navItem.icon ?? Icons.Entity ?? IconPlaceholder;

  const isActive = isRouteActive(selectedPath, item);

  return (
    <NavItem
      href={navItem.link}
      onClick={(event) => {
        if (drawerType === 'overlay') {
          onOpenChange(false);
        }
        event.preventDefault();
        router.push(navItem.link);
      }}
      icon={
        <Icon
          size={20}
          filled={isActive}
          color={
            isActive ? 'var(--colorNeutralForeground2BrandSelected)' : undefined
          }
        />
      }
      value={isActive ? 'active' : ''}
    >
      {navItem.label}
    </NavItem>
  );
};

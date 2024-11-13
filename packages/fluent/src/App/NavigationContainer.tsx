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
import { IconPlaceholder, Icons } from '@headless-adminapp/icons';
import { Fragment, useState } from 'react';

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

export const NavigationContainer = () => {
  const styles = useStyles();
  const { app, schemaMetadataDic } = useAppContext();

  const [isOpen] = useState(true);
  const [type] = useState<DrawerType>('inline');

  const router = useRouter();
  const pathname = usePathname();

  const selectedPath = pathname;
  const { language } = useLocale();

  const isRouteActive = useIsRouteActive();
  const routeResolver = useRouteResolver();

  return (
    <div className={styles.root}>
      <NavDrawer selectedValue="active" open={isOpen} type={type}>
        <NavDrawerBody style={{ paddingTop: 8 }}>
          {app.navItems.map((area) => (
            <Fragment key={area.label}>
              {area.groups.map((group) => (
                <Fragment key={group.label}>
                  {!group.hideLabel && (
                    <NavSectionHeader>{group.label}</NavSectionHeader>
                  )}
                  {group.items.map((item, index) => {
                    const navItem = transformNavPageItem({
                      item,
                      schemaMetadataDic: schemaMetadataDic,
                      language,
                      routeResolver,
                    });

                    const Icon =
                      navItem.icon ?? Icons.Entity ?? IconPlaceholder;

                    const isActive = isRouteActive(selectedPath, item);

                    return (
                      <NavItem
                        key={index}
                        href={navItem.link}
                        onClick={(event) => {
                          event.preventDefault();
                          router.push(navItem.link);
                        }}
                        icon={
                          <Icon
                            size={20}
                            filled={isActive}
                            color={
                              isActive
                                ? 'var(--colorNeutralForeground2BrandSelected)'
                                : undefined
                            }
                          />
                        }
                        value={isActive ? 'active' : ''}
                      >
                        {navItem.label}
                      </NavItem>
                    );
                  })}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};

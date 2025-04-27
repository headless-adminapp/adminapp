import { Divider, makeStyles, tokens } from '@fluentui/react-components';
import {
  NavCategory,
  NavDrawer,
  NavDrawerBody,
  NavSectionHeader,
  NavSubItemGroup,
} from '@fluentui/react-nav-preview';
import { useAppContext } from '@headless-adminapp/app/app';
import { useLocale } from '@headless-adminapp/app/locale';
import {
  useIsRouteActive,
  usePathname,
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { PageType } from '@headless-adminapp/core/experience/app';
import { FC, Fragment, useMemo } from 'react';

import { NavCategoryItemComponent } from './NavCategoryItemComponent';
import { NavItemComponent } from './NavItemComponent';
import { NavMiniCategoryMenu } from './NavMiniCategoryMenu';
import { NavSubItemComponent } from './NavSubItemComponent';
import { DrawerType, NavItemInfo, NavSubItemInfo } from './types';
import { transformNavSections } from './utils';

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    display: 'flex',
    flexShrink: 0,
    boxShadow: tokens.shadow4,
    zIndex: 1,
  },
});

interface NavigationContainerProps {
  open: boolean;
  type: DrawerType;
  isMini: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavigationContainer: FC<NavigationContainerProps> = ({
  open,
  type,
  onOpenChange,
  isMini,
}) => {
  const styles = useStyles();
  const { appExperience: app } = useAppContext();

  const { schemaMetadataDic } = useAppContext();

  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLocale();

  const isRouteActive = useIsRouteActive();
  const routeResolver = useRouteResolver();

  const sections = useMemo(
    () =>
      transformNavSections({
        navItems: app.navItems,
        schemaMetadataDic,
        language,
        routeResolver,
        isRouteActive,
        selectedPath: pathname,
      }),
    [
      app.navItems,
      schemaMetadataDic,
      language,
      routeResolver,
      isRouteActive,
      pathname,
    ]
  );

  // const activeCategories = useMemo(
  //   () =>
  //     sections
  //       .map((section) => section.items)
  //       .flat()
  //       .filter(
  //         (item) =>
  //           item.type === 'category' &&
  //           item.items.some((subItem) => subItem.active)
  //       )
  //       .map((item) => item.key),
  //   [sections]
  // );

  const handleNavigation = (item: NavItemInfo | NavSubItemInfo) => {
    if (type === 'overlay') {
      onOpenChange(false);
    }

    if (item.isExternal) {
      window.open(item.link, '_blank');
    } else {
      router.push(item.link);
    }
  };

  return (
    <div className={styles.root}>
      <NavDrawer
        selectedValue="active"
        selectedCategoryValue="active"
        defaultOpenCategories={['active']}
        open={open || isMini}
        type={type}
        onOpenChange={(_value, data) => onOpenChange(data.open)}
        onNavItemSelect={() => {
          // do nothing
        }}
        style={{ width: isMini ? 60 : undefined }}
      >
        <NavDrawerBody
          style={{
            paddingTop: 8,
          }}
        >
          {sections.map((section, index) => (
            <Fragment key={section.label}>
              {!section.hideLabel && !isMini && (
                <NavSectionHeader>{section.label}</NavSectionHeader>
              )}
              {isMini && index > 0 && (
                <div>
                  <Divider style={{ opacity: 0.5 }} />
                </div>
              )}
              {section.items.map((item) => {
                if (item.type === PageType.Category) {
                  const isActive = item.items.some((subItem) => subItem.active);

                  if (isMini) {
                    return (
                      <NavMiniCategoryMenu
                        key={item.key}
                        isActive={isActive}
                        item={item}
                        onSelect={handleNavigation}
                      />
                    );
                  }

                  return (
                    <NavCategory
                      key={item.key}
                      value={isActive ? 'active' : ''}
                    >
                      <NavCategoryItemComponent
                        item={item}
                        isActive={isActive}
                      />
                      <NavSubItemGroup>
                        {item.items.map((subItem) => (
                          <NavSubItemComponent
                            key={subItem.key}
                            item={subItem}
                            onClick={handleNavigation}
                          />
                        ))}
                      </NavSubItemGroup>
                    </NavCategory>
                  );
                }

                return (
                  <NavItemComponent
                    key={item.key}
                    item={item}
                    onClick={handleNavigation}
                    isMini={isMini}
                  />
                );
              })}
            </Fragment>
          ))}
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};

import {
  InternalIsRouteActive,
  InternalRouteResolver,
} from '@headless-adminapp/app/route/context';
import {
  NavPageItem,
  NavPageSection,
  PageType,
} from '@headless-adminapp/core/experience/app';
import { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';
import { IconPlaceholder, Icons } from '@headless-adminapp/icons';

import {
  NavCategoryInfo,
  NavItemInfo,
  NavPageItemTransformed,
  NavPageSectionWithKey,
  NavSubItemInfo,
} from './types';

export function transformNavSections({
  navItems,
  schemaMetadataDic,
  language,
  routeResolver,
  isRouteActive,
  selectedPath,
}: {
  navItems: NavPageSection[];
  schemaMetadataDic: Record<string, SchemaExperienceMetadata>;
  language: string;
  routeResolver: InternalRouteResolver;
  isRouteActive: InternalIsRouteActive;
  selectedPath: string;
}): NavPageSectionWithKey[] {
  return navItems.map((section, sectionIndex) => {
    return {
      ...section,
      key: `section:${sectionIndex}`,
      items: section.items.map((item, itemIndex) => {
        if (item.type === PageType.Category) {
          return {
            type: 'category',
            key: `category:${sectionIndex}:${itemIndex}`,
            Icon: item.Icon ?? IconPlaceholder,
            label: item.label,
            items: item.items.map((item, subItemIndex) => {
              const navItem = transformNavPageItem({
                item,
                schemaMetadataDic: schemaMetadataDic,
                language,
                routeResolver,
              });

              return {
                type: 'subItem',
                key: `item:${sectionIndex}:${itemIndex}:${subItemIndex}`,
                label: navItem.label,
                link: navItem.link,
                active: isRouteActive(selectedPath, item),
                isExternal: navItem.isExternal,
                RightComponent: item.RightComponent,
              } as NavSubItemInfo;
            }),
          } as NavCategoryInfo;
        }

        const navItem = transformNavPageItem({
          item,
          schemaMetadataDic: schemaMetadataDic,
          language,
          routeResolver,
        });

        const Icon = navItem.Icon ?? Icons.Entity ?? IconPlaceholder;

        const isActive = isRouteActive(selectedPath, item);

        return {
          type: 'item',
          key: `item:${sectionIndex}:${itemIndex}`,
          label: navItem.label,
          Icon: Icon,
          link: navItem.link,
          active: isActive,
          isExternal: navItem.isExternal,
          RightComponent: item.RightComponent,
        } as NavItemInfo;
      }),
    };
  });
}

export function transformNavPageItem({
  item,
  schemaMetadataDic: schemaMetadataObject,
  language,
  routeResolver,
}: {
  item: NavPageItem;
  schemaMetadataDic: Record<string, SchemaExperienceMetadata>;
  language: string;
  routeResolver: InternalRouteResolver;
}): NavPageItemTransformed {
  let Icon = item.Icon;
  let label = item.localizedLabel?.[language] ?? item.label;
  let link = routeResolver(item);

  if (item.type === 'entityview') {
    const metadata = schemaMetadataObject?.[item.logicalName];
    if (metadata) {
      if (!label) {
        label =
          metadata.localizedPluralLabels?.[language] ?? metadata.pluralLabel;
      }

      if (!Icon) {
        Icon = metadata.Icon;
      }
    }
  }

  return {
    label,
    Icon,
    link,
    isExternal: item.type === 'external',
  };
}

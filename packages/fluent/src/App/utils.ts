import { InternalRouteResolver } from '@headless-adminapp/app/route/context';
import { NavPageItem } from '@headless-adminapp/core/experience/app';
import { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';

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
}) {
  let icon = item.icon;
  let label = item.localizedLabel?.[language] ?? item.label;
  let link = routeResolver(item);

  if (item.type === 'entityview') {
    const metadata = schemaMetadataObject?.[item.logicalName];
    if (metadata) {
      if (!label) {
        label =
          metadata.localizedPluralLabels?.[language] ?? metadata.pluralLabel;
      }

      if (!icon) {
        icon = metadata.icon;
      }
    }
  }

  return {
    label,
    icon,
    link,
    isExternal: item.type === 'external',
  };
}

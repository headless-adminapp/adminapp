import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import { useDataFormSchema } from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { isLookupAttribute } from '@headless-adminapp/core/attributes/utils';
import { Schema } from '@headless-adminapp/core/schema';
import { Localized } from '@headless-adminapp/core/types';
import { Icons } from '@headless-adminapp/icons';
import { useMemo } from 'react';

import { usePageEntityFormStrings } from './PageEntityFormStringContext';

export interface RelatedItemInfo {
  key: string;
  logicalName: string;
  label: string;
  localizedLabels?: Localized<string>;
  pluralLabel: string;
  localizedPluralLabels?: Localized<string>;
  attributeName: string;
}

function getRelatedItems(
  currentSchema: Schema,
  schemas: Record<string, Schema>
): RelatedItemInfo[] {
  return Object.values(schemas)
    .map((s) => {
      return Object.entries(s.attributes)
        .map(([key, attribute]) => {
          if (!isLookupAttribute(attribute)) {
            return null;
          }

          if (attribute.entity !== currentSchema.logicalName) {
            return null;
          }

          return {
            key,
            attribute,
          };
        })
        .filter(Boolean)
        .map((item) => {
          if (!item) {
            throw new Error('item is null');
          }

          return {
            key: `${s.logicalName}.${item.key}`,
            logicalName: s.logicalName,
            label: s.label,
            localizedLabels: s.localizedLabels,
            pluralLabel: s.pluralLabel,
            localizedPluralLabels: s.localizedPluralLabels,
            attributeName: item.key,
          };
        });
    })
    .flat();
}

interface RelatedViewSelectorProps {
  onSelect: (item: RelatedItemInfo) => void;
}

export function RelatedViewSelector(props: RelatedViewSelectorProps) {
  const schema = useDataFormSchema();
  const { schemas } = useMetadata();
  const strings = usePageEntityFormStrings();
  const { language } = useLocale();

  const data = useMemo(
    () => getRelatedItems(schema, schemas),
    [schema, schemas]
  );

  if (!data.length) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <button
          style={{
            border: 'none',
            overflow: 'hidden',
            borderRadius: tokens.borderRadiusMedium,
            padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalMNudge}`,
            fontFamily: tokens.fontFamilyBase,
            lineHeight: tokens.lineHeightBase300,
            backgroundColor: tokens.colorTransparentBackground,
            alignItems: 'center',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            outlineStyle: 'none',
            textTransform: 'none',
            columnGap: tokens.spacingHorizontalSNudge,
          }}
        >
          {strings.related}
          <Icons.ChevronDown size={16} />
        </button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {data.map((item) => (
            <MenuItem key={item.key} onClick={() => props.onSelect(item)}>
              {item.localizedPluralLabels?.[language] ?? item.pluralLabel}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

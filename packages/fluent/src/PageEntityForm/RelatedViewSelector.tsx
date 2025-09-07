import {
  Menu,
  MenuList,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import { RelatedItemInfo } from '@headless-adminapp/app/dataform/context';
import {
  useDataFormSchema,
  useRecordId,
  useSelectedForm,
} from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { isLookupAttribute } from '@headless-adminapp/core/attributes/utils';
import { FormRelatedItemInfo } from '@headless-adminapp/core/experience/form/Form';
import { Schema } from '@headless-adminapp/core/schema';
import { Icons } from '@headless-adminapp/icons';
import { useMemo } from 'react';

import { MenuItem, MenuPopover } from '../components/fluent';
import { usePageEntityFormStrings } from './PageEntityFormStringContext';

function getRelatedItems(
  currentSchema: Schema,
  schemas: Record<string, Schema>,
  relatedItems?: FormRelatedItemInfo[] | null
): RelatedItemInfo[] {
  if (relatedItems === null) {
    return [];
  }

  if (relatedItems) {
    return relatedItems.map((item) => {
      const schema = schemas[item.logicalName];
      if (!schema) {
        throw new Error(`Schema not found: ${item.logicalName}`);
      }

      if (!schema.attributes[item.attributeName]) {
        throw new Error(
          `Attribute not found: ${item.logicalName}.${item.attributeName}`
        );
      }

      const attribute = schema.attributes[item.attributeName];

      if (!isLookupAttribute(attribute)) {
        throw new Error(
          `Attribute is not a lookup: ${item.logicalName}.${item.attributeName}`
        );
      }

      if (attribute.entity !== currentSchema.logicalName) {
        throw new Error(
          `Attribute entity does not match: ${item.logicalName}.${item.attributeName}`
        );
      }

      return {
        key: `${schema.logicalName}.${item.attributeName}`,
        logicalName: schema.logicalName,
        attributeName: item.attributeName,
        pluralLabel: item.pluralLabel ?? schema.pluralLabel,
        localizedPluralLabels:
          item.localizedPluralLabels ?? schema.localizedPluralLabels,
      };
    });
  }

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
            attributeName: item.key,
            pluralLabel: item.attribute.relatedLabel ?? s.pluralLabel,
            localizedPluralLabels:
              item.attribute.localizedRelatedLabel ?? s.localizedPluralLabels,
          };
        });
    })
    .flat();
}

interface RelatedViewSelectorProps {
  onSelect: (item: RelatedItemInfo) => void;
}

export function RelatedViewSelector(props: Readonly<RelatedViewSelectorProps>) {
  const schema = useDataFormSchema();
  const recordId = useRecordId();
  const formConfig = useSelectedForm();
  const { schemas } = useMetadata();
  const strings = usePageEntityFormStrings();
  const { language } = useLocale();

  const data = useMemo(
    () => getRelatedItems(schema, schemas, formConfig.experience.relatedItems),
    [formConfig.experience.relatedItems, schema, schemas]
  );

  if (!data.length || !recordId) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger>
        <button
          style={{
            border: 'none',
            overflow: 'hidden',
            padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalMNudge}`,
            fontFamily: tokens.fontFamilyBase,
            lineHeight: tokens.lineHeightBase300,
            fontSize: tokens.fontSizeBase300,
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
            color: tokens.colorNeutralForeground2,
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

import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Input,
  Option,
  tokens,
} from '@fluentui/react-components';
import { localizedLabel } from '@headless-adminapp/app/builders';
import {
  TransformedViewColumn,
  transformViewColumns,
} from '@headless-adminapp/app/datagrid';
import { useDataGridSchema } from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { LookupAttribute } from '@headless-adminapp/core/attributes';
import { Icons } from '@headless-adminapp/icons';
import { useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { usePageEntityViewStrings } from '../../PageEntityView/PageEntityViewStringContext';

interface AddColumnsProps {
  onColumnAdd: (column: TransformedViewColumn) => void;
  onColumnRemove: (column: TransformedViewColumn) => void;
  columns: TransformedViewColumn[];
  opened: boolean;
  onClose: () => void;
}

export function AddColumns({
  onColumnAdd,
  onColumnRemove,
  columns,
  opened,
  onClose,
}: AddColumnsProps) {
  const schema = useDataGridSchema();
  const { schemaStore } = useMetadata();
  const { language } = useLocale();
  const strings = usePageEntityViewStrings();
  const appStrings = useAppStrings();

  const lookupAttributes = Object.entries(schema.attributes)
    .map(([key, attribute]) => ({
      key,
      attribute,
    }))
    .filter(({ attribute }) => attribute.type === 'lookup') as Array<{
    key: string;
    attribute: LookupAttribute;
  }>;

  const columnGroups: Record<
    string,
    {
      label: string;
      columns: TransformedViewColumn[];
    }
  > = {
    root: {
      label: localizedLabel(language, schema),
      columns: transformViewColumns(
        schema.logicalName,
        Object.keys(schema.attributes).map((key) => ({
          name: key,
        })),
        schemaStore,
        language
      ),
    },
    ...lookupAttributes.reduce((acc, { key, attribute }) => {
      const lookupSchema = schemaStore.getSchema(attribute.entity);
      const columns = transformViewColumns(
        schema.logicalName,
        Object.keys(lookupSchema.attributes).map((nestedKey) => ({
          name: key,
          expandedKey: nestedKey,
        })),
        schemaStore,
        language
      );

      acc[key] = {
        label:
          localizedLabel(language, attribute) +
          ' (' +
          localizedLabel(language, lookupSchema) +
          ')',
        columns,
      };
      return acc;
    }, {} as Record<string, { label: string; columns: TransformedViewColumn[] }>),
  };

  const tableItems = Object.entries(columnGroups).map(([key, group]) => ({
    key,
    label: group.label,
  }));

  const [selectedGroup, setSelectedGroup] = useState('root');

  const selectedGroupItem = tableItems.find((x) => x.key === selectedGroup);

  const availableColumns = columnGroups[selectedGroup].columns;

  const [searchText, setSearchText] = useState('');

  const filteredColumns = availableColumns.filter((column) =>
    column.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const includedColumnsObj = columns.reduce((acc, column) => {
    acc[column.id] = true;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <Drawer separator open={opened} position="end">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Icons.Close />}
              onClick={onClose}
            />
          }
        >
          {strings.addColumns}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 8,
            marginBottom: tokens.spacingVerticalXS,
            paddingInline: tokens.spacingHorizontalS,
            width: '100%',
          }}
        >
          <Input
            contentBefore={<Icons.Search size={16} />}
            placeholder={appStrings.searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Dropdown
            value={selectedGroupItem?.label ?? ''}
            selectedOptions={
              selectedGroupItem ? [String(selectedGroupItem.key)] : []
            }
            onOptionSelect={(event, data) => {
              setSelectedGroup(data.optionValue as string);
            }}
            style={{ flex: 1, minWidth: 'unset' }}
            positioning={{
              align: 'bottom',
              position: 'below',
            }}
          >
            {tableItems.map((x) => (
              <Option key={x.key} value={x.key}>
                {x.label}
              </Option>
            ))}
          </Dropdown>
        </div>
        <Divider />
      </div>
      <DrawerBody style={{ paddingInline: 0 }}>
        {filteredColumns.map((column) => (
          <Button
            key={column.id}
            appearance="transparent"
            icon={<Checkbox checked={includedColumnsObj[column.id] ?? false} />}
            style={{
              fontWeight: tokens.fontSizeBase400,
              width: '100%',
              justifyContent: 'flex-start',
              paddingInline: tokens.spacingHorizontalS,
            }}
            onClick={() => {
              if (includedColumnsObj[column.id]) {
                onColumnRemove(column);
              } else {
                onColumnAdd(column);
              }
            }}
          >
            {column.label}
          </Button>
        ))}
      </DrawerBody>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Divider />
        <div
          style={{
            display: 'flex',
            padding: 8,
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          <Button onClick={onClose}>{strings.close}</Button>
        </div>
      </div>
    </Drawer>
  );
}

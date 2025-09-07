import {
  Menu,
  MenuList,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import {
  useChangeView,
  useDataGridSchema,
  useGridViewLookupData,
  useSelectedView,
} from '@headless-adminapp/app/datagrid/hooks';
import { MobileHeaderTitle } from '@headless-adminapp/app/header/components/MobileHeaderTitle';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata';
import { Icons } from '@headless-adminapp/icons';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

import { Button, MenuItem, MenuPopover } from '../components/fluent';

export const MobileHeaderTitleContainer: FC = () => {
  const { language } = useLocale();

  const viewLookup = useGridViewLookupData();
  const selectedView = useSelectedView();
  const changeView = useChangeView();
  const schema = useDataGridSchema();
  const { experienceStore } = useMetadata();

  const { data: defaultViewId, isPending } = useQuery({
    queryKey: ['experience-schema-default-view-id', schema.logicalName],
    queryFn: () => experienceStore.getDefaultViewId(schema.logicalName),
  });

  if (viewLookup.length < 2) {
    if (isPending || selectedView.id === defaultViewId) {
      return null;
    }
  }

  return (
    <MobileHeaderTitle
      order={3}
      title={
        <Menu hasIcons>
          <MenuTrigger>
            <Button
              appearance="subtle"
              icon={{
                style: { color: 'inherit' },
                children: <Icons.ChevronDown />,
              }}
              iconPosition="after"
              style={{
                fontSize: tokens.fontSizeBase400,
                fontWeight: tokens.fontWeightSemibold,
                lineHeight: tokens.lineHeightBase400,
                color: 'inherit',
                backgroundColor: 'transparent',
                paddingInline: 0,
                justifyContent: 'flex-start',
              }}
            >
              <span
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {selectedView.localizedNames?.[language] ?? selectedView.name}
              </span>
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {viewLookup.map((view) => (
                <MenuItem
                  key={view.id}
                  onClick={() => changeView(view.id)}
                  icon={
                    selectedView.id === view.id ? (
                      <Icons.Checkmark />
                    ) : undefined
                  }
                >
                  {view.localizedNames?.[language] ?? view.name}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      }
    />
  );
};

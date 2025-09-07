import { Menu, MenuList, MenuTrigger } from '@fluentui/react-components';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useChangeView,
  useGridViewLookupData,
  useSelectedView,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { Button, MenuItem, MenuPopover } from '../components/fluent';

export const FormSubgridViewSelector: FC = () => {
  const viewLookup = useGridViewLookupData();
  const selectedView = useSelectedView();
  const changeView = useChangeView();
  const { language } = useLocale();
  const allowViewSelection = useContextSelector(
    GridContext,
    (state) => state.allowViewSelection
  );

  return (
    <div
      style={{
        alignItems: 'center',
        paddingBlock: 4,
        paddingInline: 4,
        gap: 16,
        width: '100%',
        display: 'flex',
        height: 40,
      }}
    >
      <div
        style={{
          flex: 1,
          alignItems: 'center',
          gap: 16,
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <Menu>
          <MenuTrigger>
            <Button
              appearance="subtle"
              icon={allowViewSelection ? <Icons.ChevronDown /> : null}
              iconPosition="after"
              style={{
                paddingInline: 8,
                paddingBlock: 4,
                pointerEvents: allowViewSelection ? 'auto' : 'none',
              }}
            >
              {selectedView.localizedNames?.[language] ?? selectedView.name}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {viewLookup.map((view) => (
                <MenuItem key={view.id} onClick={() => changeView(view.id)}>
                  {view.localizedNames?.[language] ?? view.name}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
};

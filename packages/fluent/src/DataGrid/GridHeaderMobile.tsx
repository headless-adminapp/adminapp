import {
  Button,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import {
  useChangeView,
  useGridViewLookupData,
  useSearchText,
  useSelectedView,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { useAppStrings } from '../App/AppStringContext';

interface GridHeaderMobileProps {}

export const GridHeaderMobile: FC<GridHeaderMobileProps> = () => {
  const viewLookup = useGridViewLookupData();
  const selectedView = useSelectedView();
  const changeView = useChangeView();
  const [searchText, setSearchText] = useSearchText();
  const { language } = useLocale();
  const appStrings = useAppStrings();

  return (
    <div
      style={{
        alignItems: 'center',
        paddingInline: 8,
        gap: 8,
        display: 'flex',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 16, flex: 1 }}>
        <Input
          contentBefore={<Icons.Search size={16} />}
          placeholder={appStrings.searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          gap: 16,
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <Menu hasIcons>
          <MenuTrigger>
            <Button
              appearance="subtle"
              icon={<Icons.Filter />}
              iconPosition="after"
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {viewLookup.map((view) => (
                <MenuItem
                  key={view.id}
                  onClick={() => changeView(view.id as string)}
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
      </div>
    </div>
  );
};

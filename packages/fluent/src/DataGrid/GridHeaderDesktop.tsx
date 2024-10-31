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
import { FC, useState } from 'react';

import { useAppStrings } from '../App/AppStringContext';
import { usePageEntityViewStrings } from '../PageEntityView/PageEntityViewStringContext';
import { CustomizeColumns } from './CustomizeColumns';

interface GridHeaderDesktopProps {
  headingRight?: React.ReactNode;
}

export const GridHeaderDesktop: FC<GridHeaderDesktopProps> = (props) => {
  const viewLookup = useGridViewLookupData();
  const selectedView = useSelectedView();
  const changeView = useChangeView();
  const [searchText, setSearchText] = useSearchText();
  const [isColumnCustomizationOpen, setIsColumnCustomizationOpen] =
    useState(false);
  const { language } = useLocale();
  const strings = usePageEntityViewStrings();
  const appStrings = useAppStrings();

  return (
    <div
      style={{
        alignItems: 'center',
        paddingInline: 8,
        gap: 16,
        display: 'flex',
      }}
    >
      <CustomizeColumns
        opened={isColumnCustomizationOpen}
        onClose={() => setIsColumnCustomizationOpen(false)}
        // strings={strings.customizeColumns}
      />
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
              icon={<Icons.ChevronDown />}
              iconPosition="after"
            >
              {selectedView.localizedNames?.[language] ?? selectedView.name}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {viewLookup.map((view) => (
                <MenuItem
                  key={view.id}
                  onClick={() => changeView(view.id as string)}
                >
                  {view.localizedNames?.[language] ?? view.name}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
        {props.headingRight}
        <Button
          appearance="subtle"
          icon={<Icons.EditColumns size={24} />}
          onClick={() => setIsColumnCustomizationOpen(true)}
        >
          {strings.editColumns}
        </Button>
        <Input
          contentBefore={<Icons.Search size={16} />}
          placeholder={appStrings.searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
};

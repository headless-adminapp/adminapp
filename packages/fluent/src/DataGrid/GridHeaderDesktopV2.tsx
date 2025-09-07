import {
  Menu,
  MenuList,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import {
  EnabledRules,
  exportRecordsToCSV,
  exportRecordsToExcel,
  processDeleteRecordRequest,
  ViewCommandBuilder,
} from '@headless-adminapp/app/builders/CommandBuilder/ViewCommandBuilder';
import {
  useChangeView,
  useDataGridSchema,
  useGridViewLookupData,
  useMainGridCommandHandlerContext,
  useSearchText,
  useSelectedView,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { Icons } from '@headless-adminapp/icons';
import { FC, useState } from 'react';

import { useAppStrings } from '../App/AppStringContext';
import { Button, MenuItem, MenuPopover, SearchBox } from '../components/fluent';
import { usePageEntityViewStrings } from '../PageEntityView/PageEntityViewStringContext';
import { CustomizeColumns } from './CustomizeColumns';

interface GridHeaderDesktopProps {
  headingRight?: React.ReactNode;
}

// Exprement component
export const GridHeaderDesktopV2: FC<GridHeaderDesktopProps> = (props) => {
  const viewLookup = useGridViewLookupData();
  const selectedView = useSelectedView();
  const changeView = useChangeView();
  const [searchText, setSearchText] = useSearchText();
  const [isColumnCustomizationOpen, setIsColumnCustomizationOpen] =
    useState(false);
  const { language } = useLocale();
  const strings = usePageEntityViewStrings();
  const appStrings = useAppStrings();
  const schema = useDataGridSchema();
  const openForm = useOpenForm();

  const commandContext = useMainGridCommandHandlerContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          alignItems: 'center',
          gap: 16,
          display: 'flex',
        }}
      >
        <CustomizeColumns
          opened={isColumnCustomizationOpen}
          onClose={() => setIsColumnCustomizationOpen(false)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Menu>
            <MenuTrigger>
              <Button
                appearance="subtle"
                icon={<Icons.ChevronDown />}
                iconPosition="after"
                style={{
                  fontSize: tokens.fontSizeBase400,
                  fontWeight: tokens.fontWeightMedium,
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
        <div
          style={{
            flex: 1,
          }}
        />
        <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
          {props.headingRight}
          {EnabledRules.HasAtLeastOneRecordSelected(commandContext) &&
            EnabledRules.HasDeletePermission(commandContext) && (
              <Button
                appearance="secondary"
                icon={<Icons.Delete size={20} />}
                onClick={() =>
                  processDeleteRecordRequest(commandContext, {
                    stringSet: ViewCommandBuilder.defaultDeleteRecordStringSet,
                  })
                }
                style={{ fontWeight: tokens.fontWeightRegular }}
              >
                Delete
              </Button>
            )}
          <Button
            appearance="primary"
            icon={<Icons.Add />}
            onClick={async () => {
              await openForm({
                logicalName: schema.logicalName,
              });
            }}
            style={{ fontWeight: tokens.fontWeightRegular, minWidth: 0 }}
          >
            New {schema.label.toLowerCase()}
          </Button>
          <Menu hasIcons>
            <MenuTrigger>
              <Button
                appearance="subtle"
                icon={<Icons.MoreVertical size={24} />}
                onClick={() => {}}
                style={{ fontWeight: tokens.fontWeightRegular }}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  icon={<Icons.EditColumns size={20} />}
                  onClick={() => setIsColumnCustomizationOpen(true)}
                >
                  {strings.editColumns}
                </MenuItem>
                <Menu hasIcons>
                  <MenuTrigger disableButtonEnhancement>
                    <MenuItem icon={<Icons.Export size={20} />}>
                      Export
                    </MenuItem>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem
                        icon={<Icons.ExportCsv size={20} />}
                        onClick={() => exportRecordsToCSV(commandContext)}
                      >
                        Export to CSV
                      </MenuItem>
                      <MenuItem
                        icon={<Icons.ExportExcel size={20} />}
                        onClick={() => exportRecordsToExcel(commandContext)}
                      >
                        Export to Excel
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
      <div style={{ paddingBlock: 8 }}>
        {/* <Divider style={{ opacity: 0.2 }} /> */}
      </div>
      <div
        style={{
          alignItems: 'center',
          // paddingInline: 8,
          gap: 16,
          display: 'flex',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <SearchBox
            appearance="outline"
            placeholder={appStrings.searchPlaceholder}
            style={{
              width: 300,
              borderBottomColor: tokens.colorNeutralStroke1,
            }}
            value={searchText}
            onChange={(e, data) => setSearchText(data.value)}
          />
        </div>
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
};

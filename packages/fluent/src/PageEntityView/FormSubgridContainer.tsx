import { Divider, Input } from '@fluentui/react-components';
import { useSearchText } from '@headless-adminapp/app/datagrid/hooks';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { useAppStrings } from '../App/AppStringContext';
import { FormSubgridCommandContainer } from '../DataGrid/FormSubgridCommandContainer';
import { FormSubgridViewSelector } from '../DataGrid/FormSubgridViewSelector';
import { GridPaginationContainer } from '../DataGrid/GridPaginationContainer';
import { GridTableContainer } from '../DataGrid/GridTableContainer';

interface FormSubgridContainerProps {
  hideCommandBar?: boolean;
  hideSearch?: boolean;
}

export const FormSubgridContainer: FC<FormSubgridContainerProps> = ({
  hideCommandBar,
  hideSearch,
}) => {
  const appStrings = useAppStrings();
  const [searchText, setSearchText] = useSearchText();

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 8,
        // backgroundColor: tokens.colorNeutralBackground2,
        // padding: 2,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          // gap: 12,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          // overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
          }}
        >
          <FormSubgridViewSelector />
        </div>
        <div>
          <Divider style={{ opacity: 0.2 }} />
        </div>
        {(!hideCommandBar || !hideSearch) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 40,
              overflow: 'hidden',
              width: '100%',
              paddingBlock: 4,
            }}
          >
            <div style={{ flex: 1 }}>
              {!hideCommandBar && <FormSubgridCommandContainer />}
            </div>
            <div style={{ flex: 1 }} />
            {!hideSearch && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  flexShrink: 0,
                  paddingInline: 8,
                }}
              >
                <Input
                  contentBefore={<Icons.Search size={16} />}
                  placeholder={appStrings.searchPlaceholder}
                  appearance="filled-darker"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              gap: 16,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div style={{ flex: 1, display: 'flex', minHeight: 300 }}>
              <GridTableContainer />
            </div>
          </div>
          <div
            style={{
              paddingInline: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingBottom: 8,
            }}
          >
            <Divider style={{ opacity: 0.5 }} />
            <GridPaginationContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

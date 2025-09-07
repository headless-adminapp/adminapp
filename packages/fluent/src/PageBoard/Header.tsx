import { Caption1, Subtitle2, tokens } from '@fluentui/react-components';
import {
  useBoardSchema,
  useSearchText,
} from '@headless-adminapp/app/board/hooks';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { Icons } from '@headless-adminapp/icons';
import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';

import { useAppStrings } from '../App/AppStringContext';
import { Button, SearchBox } from '../components/fluent';
import { HeaderQuickFilter } from './HeaderQuickFilter';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  const client = useQueryClient();
  const schema = useBoardSchema();
  const isMobile = useIsMobile();

  const [searchText, setSearchText] = useSearchText();
  const appStrings = useAppStrings();

  const refresh = async () => {
    await client.invalidateQueries({
      queryKey: ['data', 'retriveRecords', schema.logicalName],
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: tokens.spacingHorizontalM,
        }}
      >
        <div style={{ flex: 1 }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Subtitle2 style={{ color: tokens.colorNeutralForeground1 }}>
                {title}
              </Subtitle2>
              <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                {subtitle}
              </Caption1>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacingHorizontalS,
          }}
        >
          <SearchBox
            appearance="filled-darker"
            placeholder={appStrings.searchPlaceholder}
            value={searchText}
            onChange={(e, data) => setSearchText(data.value)}
          />
          <Button
            appearance="subtle"
            icon={<Icons.Refresh size={20} />}
            onClick={refresh}
          ></Button>
        </div>
      </div>
      <HeaderQuickFilter />
    </div>
  );
};

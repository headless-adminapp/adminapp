// eslint-disable-next-line simple-import-sort/imports
import {
  Button,
  Caption1,
  SearchBox,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useSearchText,
  useBoardSchema,
} from '@headless-adminapp/app/board/hooks';
import { Icons } from '@headless-adminapp/icons';
import { useAppStrings } from '../App/AppStringContext';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  const client = useQueryClient();
  const schema = useBoardSchema();

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
        alignItems: 'center',
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
  );
};

import { Body1, Divider, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { FormSubgridViewSelector } from '../DataGrid/FormSubgridViewSelector';
import { usePageEntityViewStrings } from './PageEntityViewStringContext';

export const FormSubgridNotAvailableContainer: FC = () => {
  const strings = usePageEntityViewStrings();

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 8,
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
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: tokens.spacingVerticalM,
                minHeight: 300,
                color: tokens.colorNeutralForeground3,
              }}
            >
              <Icons.Grid size={48} />
              <Body1>{strings.subgridNotAvailable}</Body1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

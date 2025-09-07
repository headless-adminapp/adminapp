import { Title2, tokens } from '@fluentui/react-components';
import { FC } from 'react';

import { extendedTokens } from '../components/fluent';

interface WidgetTileContainerProps {}

export const WidgetTileContainer: FC<WidgetTileContainerProps> = ({}) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow2,
        borderRadius: extendedTokens.controlBorderRadius,
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', flex: 1 }}>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            paddingInline: 16,
          }}
        >
          <Title2>Not supported yet</Title2>
        </div>
      </div>
    </div>
  );
};

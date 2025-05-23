import { tokens } from '@fluentui/react-components';
import React, { FC } from 'react';

interface PageEntityViewMobileFrameProps {
  commandBar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
}

export const PageEntityViewMobileFrame: FC<PageEntityViewMobileFrameProps> = ({
  commandBar,
  header,
  content,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        background: tokens.colorNeutralBackground1,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          gap: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            boxShadow: tokens.shadow2,
            background: tokens.colorNeutralBackground1,
            display: 'flex',
            minHeight: 40,
            flexDirection: 'column',
            gap: 4,
            paddingBottom: 8,
          }}
        >
          {commandBar}
          {header}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: tokens.borderRadiusMedium,
          }}
        >
          <div
            style={{
              gap: 8,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div style={{ flex: 1, display: 'flex' }}>{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

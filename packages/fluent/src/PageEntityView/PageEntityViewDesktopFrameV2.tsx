import { Divider, tokens } from '@fluentui/react-components';
import React, { FC } from 'react';

interface PageEntityViewDesktopFrameProps {
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

// Exprement component
export const PageEntityViewDesktopFrameV2: FC<
  PageEntityViewDesktopFrameProps
> = ({ header, content, footer }) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 8,
        backgroundColor: tokens.colorNeutralBackground2,
        padding: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          gap: 12,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBlock: 8,
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
            {header}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: tokens.shadow2,
            borderRadius: tokens.borderRadiusMedium,
            background: tokens.colorNeutralBackground1,
            overflow: 'hidden',
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
            <div style={{ flex: 1, display: 'flex' }}>{content}</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Divider style={{ opacity: 0.5 }} />
            <div style={{ display: 'flex', paddingInline: 8, paddingBlock: 8 }}>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

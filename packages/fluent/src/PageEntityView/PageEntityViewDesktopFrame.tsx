import { Divider, tokens } from '@fluentui/react-components';
import React, { FC } from 'react';


interface PageEntityViewDesktopFrameProps {
  commandBar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

export const PageEntityViewDesktopFrame: FC<
  PageEntityViewDesktopFrameProps
> = ({ commandBar, header, content, footer }) => {
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
          // overflow: 'hidden',
        }}
      >
        <div
          style={{
            // padding: 4,
            boxShadow: tokens.shadow2,
            borderRadius: tokens.borderRadiusMedium,
            background: tokens.colorNeutralBackground1,
            display: 'flex',
            // overflow: 'hidden',
          }}
        >
          {commandBar}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: tokens.shadow2,
            borderRadius: tokens.borderRadiusMedium,
            background: tokens.colorNeutralBackground1,
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
            <div style={{ flex: 1, display: 'flex' }}>{content}</div>
          </div>
          <div
            style={{
              paddingInline: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Divider />
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

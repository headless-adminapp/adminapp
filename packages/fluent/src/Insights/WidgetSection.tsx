import { tokens } from '@fluentui/react-components';
import { FC, PropsWithChildren } from 'react';

export const WidgetSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        background: tokens.colorNeutralBackground1,
        boxShadow: 'none',
        borderRadius: tokens.borderRadiusXLarge,
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

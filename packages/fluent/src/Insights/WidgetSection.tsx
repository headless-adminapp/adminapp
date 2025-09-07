import { tokens } from '@fluentui/react-components';
import { FC, PropsWithChildren } from 'react';

import { extendedTokens } from '../components/fluent';

interface WidgetSectionProps {
  style?: React.CSSProperties;
}

export const WidgetSection: FC<PropsWithChildren<WidgetSectionProps>> = ({
  children,
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        background: tokens.colorNeutralBackground1,
        ...style,
        borderRadius: extendedTokens.paperBorderRadius,
        overflow: 'hidden',
        boxShadow: 'none',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

import {
  DrawerFooter as DrawerFooterInternal,
  tokens,
} from '@fluentui/react-components';
import { CSSProperties, FC, PropsWithChildren } from 'react';

interface DrawerFooterProps {
  justify?: CSSProperties['justifyContent'];
}

export const DrawerFooter: FC<PropsWithChildren<DrawerFooterProps>> = ({
  children,
  justify,
}) => {
  return (
    <DrawerFooterInternal
      style={{
        padding: tokens.spacingHorizontalM,
        gap: tokens.spacingHorizontalM,
        background: tokens.colorNeutralBackground2,
        justifyContent: justify,
      }}
    >
      {children}
    </DrawerFooterInternal>
  );
};

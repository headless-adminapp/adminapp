import {
  DrawerHeader as DrawerHeaderInternal,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { QuickActionItem } from '../App/QuickActionItem';

interface DrawerHeaderProps {
  title: string;
  onClose?: () => void;
  showCloseButton: boolean;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

export const DrawerHeader: FC<DrawerHeaderProps> = ({
  title,
  onClose,
  showCloseButton,
  rightContent,
  bottomContent,
}) => {
  return (
    <DrawerHeaderInternal style={{ padding: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            minHeight: 50,
            background: tokens.colorNeutralBackground3,
            paddingInline: 8,
            gap: 8,
          }}
        >
          <div
            style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}
          >
            <Subtitle2 style={{ paddingLeft: 4 }}>{title}</Subtitle2>
          </div>
          {rightContent}
          {showCloseButton && (
            <QuickActionItem
              Icon={Icons.Close}
              label="Close"
              onClick={onClose}
            />
          )}
        </div>
        {bottomContent}
      </div>
    </DrawerHeaderInternal>
  );
};

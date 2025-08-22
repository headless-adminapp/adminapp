import { DrawerHeader, Subtitle2, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';

import { QuickActionItem } from '../../App/QuickActionItem';

interface HeaderProps {
  onClose: () => void;
}

export const Header: FC<HeaderProps> = ({ onClose }) => {
  return (
    <DrawerHeader style={{ padding: 0 }}>
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
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}>
          <Subtitle2 style={{ paddingLeft: 4 }}>Sort and Filter</Subtitle2>
        </div>
        <QuickActionItem Icon={Icons.Close} label="Close" onClick={onClose} />
      </div>
    </DrawerHeader>
  );
};

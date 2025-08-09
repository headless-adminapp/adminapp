import { FC } from 'react';

import { useMobileHeaderSetValue } from '../hooks/useMobileHeaderSetValue';

interface MobileHeaderLeftContentProps {
  type: 'menu' | 'back';
  order?: number;
}

export const MobileHeaderLeftContent: FC<MobileHeaderLeftContentProps> = ({
  type,
  order = 0,
}) => {
  useMobileHeaderSetValue(type === 'back', order, 'showBackButton');

  return null;
};

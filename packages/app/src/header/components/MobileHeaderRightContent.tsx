import { FC, PropsWithChildren } from 'react';

import { useMobileHeaderSetValue } from '../hooks/useMobileHeaderSetValue';

interface MobileHeaderLeftContentProps {
  order?: number;
}

export const MobileHeaderRightContent: FC<
  PropsWithChildren<MobileHeaderLeftContentProps>
> = ({ children, order = 0 }) => {
  useMobileHeaderSetValue(children, order, 'rightComponent');

  return null;
};

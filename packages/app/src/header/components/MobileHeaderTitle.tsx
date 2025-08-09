import { FC } from 'react';

import { useMobileHeaderSetValue } from '../hooks/useMobileHeaderSetValue';

interface MobileHeaderTitleProps {
  title: React.ReactNode;
  order?: number;
}

export const MobileHeaderTitle: FC<MobileHeaderTitleProps> = ({
  title,
  order = 0,
}) => {
  useMobileHeaderSetValue(title, order, 'title');

  return null;
};

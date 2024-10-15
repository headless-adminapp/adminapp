import React, { JSX, Suspense } from 'react';

import { IconPlaceholder } from './IconPlaceholder';
import type { IconProps } from './types';

interface IconWrapperProps {
  size: IconProps['size'];
  isLazy?: boolean;
  children: JSX.Element;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  size,
  isLazy,
}) => {
  if (!isLazy) {
    return children;
  }

  return (
    <Suspense fallback={<IconPlaceholder size={size} />}>{children}</Suspense>
  );
};

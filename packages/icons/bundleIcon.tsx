import clsx from 'clsx';

import { Icon, IconProps } from './types';

export function bundleIcon(RegularIcon: Icon, FilledIcon: Icon) {
  return function BundledIcon({ className, filled, ...rest }: IconProps) {
    if (filled) {
      return (
        <FilledIcon {...rest} className={clsx('icon-filled', className)} />
      );
    }

    return (
      <RegularIcon {...rest} className={clsx('icon-regular', className)} />
    );
  };
}

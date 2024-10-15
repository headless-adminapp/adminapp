import { Icon, IconProps } from './types';

export const IconPlaceholder: Icon = ({ size }: Pick<IconProps, 'size'>) => {
  return <div style={{ width: size, height: size, display: 'inline-block' }} />;
};

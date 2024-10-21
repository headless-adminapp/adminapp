import { ComponentType, JSX } from 'react';

export type IconProps = {
  color?: string;
  size?: string | number;
  opacity?: number;
  filled?: boolean;
  className?: string;
};

export type Icon = (props: IconProps) => JSX.Element | null;

export interface IconSet {}

export type IconResolver = <T extends boolean | Icon>(
  name: keyof IconSet | (string & {}),
  placeholder?: T
) => T extends true | Icon ? Icon : Icon | undefined;

export type CreateIconFn<T extends ComponentType> = (
  icon: T | React.LazyExoticComponent<T>,
  isLazy?: boolean
) => Icon;

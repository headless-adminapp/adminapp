import { ComponentType, JSX } from 'react';

export type IconProps = {
  color?: string;
  size?: string | number;
  opacity?: number;
  filled?: boolean;
  className?: string;
};

export type Icon = (props: IconProps) => JSX.Element | null;

export interface IconSet {
  Add: Icon;
  Edit: Icon;
  Delete: Icon;
  Refresh: Icon;
  Save: Icon;
  Print: Icon;
  Download: Icon;
  Export: Icon;
  Column: Icon;
  Search: Icon;
  Phone: Icon;
  Mail: Icon;
  Calendar: Icon;
  Close: Icon;
  Eye: Icon;
  EyeOff: Icon;
  List: Icon;
  ArrowLeft: Icon;
  ArrowRight: Icon;
  Dashboard: Icon;
  Settings: Icon;
  SignOut: Icon;
  MoreVertical: Icon;
}

export type IconResolver = <T extends boolean | Icon>(
  name: keyof IconSet | (string & {}),
  placeholder?: T
) => T extends true | Icon ? Icon : Icon | undefined;

export type CreateIconFn<T extends ComponentType> = (
  icon: T | React.LazyExoticComponent<T>,
  isLazy?: boolean
) => Icon;

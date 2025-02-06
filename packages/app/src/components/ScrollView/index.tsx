import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { type ScrollbarProps, Scrollbars } from 'react-custom-scrollbars-2';

interface ScrollViewProps {
  className?: string;
  autoHide?: boolean;
  rtl?: boolean;
  onScroll?: ScrollbarProps['onScroll'];
}

export const ScrollView: FC<PropsWithChildren<ScrollViewProps>> = ({
  children,
  className,
  rtl,
  autoHide,
  onScroll,
}) => (
  <Scrollbars
    autoHide={autoHide}
    className={clsx(className, 'hdl-scrollbar', rtl && 'rtl')}
    onScroll={onScroll}
  >
    {children}
  </Scrollbars>
);

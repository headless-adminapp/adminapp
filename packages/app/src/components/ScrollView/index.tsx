import clsx from 'clsx';
import { FC, PropsWithChildren, useState } from 'react';
import { type ScrollbarProps, Scrollbars } from 'react-custom-scrollbars-2';

function getReaminingSpace(div: HTMLElement) {
  return div.scrollHeight - div.scrollTop - div.clientHeight;
}

interface ScrollViewProps {
  className?: string;
  autoHide?: boolean;
  rtl?: boolean;
  onScroll?: ScrollbarProps['onScroll'];
  shadowEffect?: boolean;
}

export const ScrollView: FC<PropsWithChildren<ScrollViewProps>> = ({
  children,
  className,
  rtl,
  autoHide,
  onScroll,
  shadowEffect = false,
}) => {
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);
  const handleScroll: ScrollbarProps['onScroll'] = (event) => {
    const div = event.target as HTMLDivElement;

    const remainingSpace = getReaminingSpace(div);

    const _isTop = div.scrollTop === 0;
    const _isBottom = remainingSpace <= 0;

    if (isTop !== _isTop) {
      setIsTop(_isTop);
    }
    if (isBottom !== _isBottom) {
      setIsBottom(_isBottom);
    }

    if (onScroll) {
      onScroll(event);
    }
  };

  return (
    <Scrollbars
      autoHide={autoHide}
      className={clsx(
        className,
        'hdl-scrollbar',
        rtl && 'rtl',
        shadowEffect && !isTop && 'hdl-scrollbar-shadow-top',
        shadowEffect && !isBottom && 'hdl-scrollbar-shadow-bottom'
      )}
      onScroll={handleScroll}
    >
      {children}
    </Scrollbars>
  );
};

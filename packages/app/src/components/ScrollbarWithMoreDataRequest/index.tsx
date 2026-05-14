import { type FC, type PropsWithChildren, useEffect, useRef } from 'react';

import { ScrollView } from '../ScrollView';

interface ScrollbarWithMoreDataRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  hasMore: boolean;
  onRequestMore: () => void;
  rtl?: boolean;
}

function getReaminingSpace(div: HTMLElement) {
  return div.scrollHeight - div.scrollTop - div.clientHeight;
}

export const ScrollbarWithMoreDataRequest: FC<
  PropsWithChildren<ScrollbarWithMoreDataRequest>
> = ({ data, onRequestMore, hasMore, children, rtl }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const onRequestMoreRef = useRef(onRequestMore);

  onRequestMoreRef.current = onRequestMore;

  useEffect(() => {
    const div = divRef.current?.parentElement;

    if (!div) {
      return;
    }

    const remainingSpace = getReaminingSpace(div);

    if (remainingSpace <= 0 && hasMore) {
      onRequestMoreRef.current();
    }
  }, [data, hasMore]);

  return (
    <ScrollView
      autoHide
      rtl={rtl}
      onScroll={(e) => {
        const div = e.target as HTMLDivElement;

        const remainingSpace = getReaminingSpace(div);

        if (remainingSpace <= 0 && hasMore) {
          onRequestMoreRef.current();
        }
      }}
    >
      <div ref={divRef}>{children}</div>
    </ScrollView>
  );
};

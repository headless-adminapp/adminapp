import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

interface ScrollbarWithMoreDataRequest {
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

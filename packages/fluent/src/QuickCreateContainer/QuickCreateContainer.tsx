import { Drawer } from '@fluentui/react-components';
import { useQuickCreateItems } from '@headless-adminapp/app/quickcreate/hooks';
import { DataLookup, Id } from '@headless-adminapp/core/attributes';
import { FC } from 'react';

import { QuickCreateItemContent } from './QuickCreateItemContent';

export const QuickCreateContainer = () => {
  const items = useQuickCreateItems();

  return (
    <>
      {items.map((item) => {
        const { id, isOpen, ...options } = item;

        return (
          <QuickCreateItem
            key={id}
            logicalName={options.logicalName}
            onClose={() => options.onCancel?.()}
            onCreate={(value) => options.onCreate?.(value)}
            isOpen={isOpen}
          />
        );
      })}
    </>
  );
};

interface QuickCreateItemProps {
  isOpen?: boolean;
  logicalName: string;
  onClose: () => void;
  onCreate: (value: DataLookup<Id>) => void;
}

const QuickCreateItem: FC<QuickCreateItemProps> = ({
  isOpen,
  logicalName,
  onClose,
  onCreate,
}) => {
  return (
    <Drawer separator open={isOpen} position="end" size="medium">
      <QuickCreateItemContent
        logicalName={logicalName}
        onClose={onClose}
        onCreate={onCreate}
      />
    </Drawer>
  );
};

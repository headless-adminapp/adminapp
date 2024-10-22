import { Skeleton } from '@fluentui/react-components';
import { FC } from 'react';

export const FormControlLoading: FC = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}
    >
      <Skeleton style={{ width: 100, height: 20 }} />
      <Skeleton style={{ height: 32 }} />
    </div>
  );
};

import { Spinner } from '@fluentui/react-components';
import { FC } from 'react';

interface BodyLoadingProps {
  loading: boolean;
}

export const BodyLoading: FC<BodyLoadingProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <Spinner />
    </div>
  );
};

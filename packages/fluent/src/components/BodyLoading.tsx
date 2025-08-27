import { Spinner, tokens } from '@fluentui/react-components';
import { FC } from 'react';

interface BodyLoadingProps {
  loading?: boolean;
}

export const BodyLoading: FC<BodyLoadingProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: tokens.colorNeutralBackground1,
          opacity: 0.7,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 11,
        }}
      >
        <Spinner size="small" />
      </div>
    </>
  );
};

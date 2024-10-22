import { Body1, Spinner } from '@fluentui/react-components';

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message }: PageLoadingProps) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
      {!!message && <Body1>{message}</Body1>}
    </div>
  );
}

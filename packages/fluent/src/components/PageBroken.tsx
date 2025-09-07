import { Body1, Title2 } from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';

import { Button } from './fluent';

interface PageBrokenProps {
  title: string;
  message?: string;
  Icon?: Icon;
}

export function PageBroken({
  title,
  message,
  Icon,
}: Readonly<PageBrokenProps>) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      {!!Icon && <Icon size={64} />}
      <Title2>{title}</Title2>
      {!!message && <Body1>{message}</Body1>}
      <Button onClick={() => window.history.back()}>Go back</Button>
    </div>
  );
}

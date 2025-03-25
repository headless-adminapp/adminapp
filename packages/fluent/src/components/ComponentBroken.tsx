import { Body1, tokens } from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';

interface ComponentBrokenProps {
  message?: string;
  Icon?: Icon;
}

export function ComponentBroken({ message, Icon }: ComponentBrokenProps) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: tokens.colorNeutralForeground3,
      }}
    >
      {!!Icon && <Icon size={40} />}
      {<Body1>{message}</Body1>}
    </div>
  );
}

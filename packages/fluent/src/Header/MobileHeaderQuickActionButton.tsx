import { makeStyles, tokens } from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';
import { FC } from 'react';

import { Button } from '../components/fluent';

const useStyles = makeStyles({
  root: {
    color: 'inherit !important',
    background: 'rgba(0, 0, 0, 0)',
    transition: 'background 0.3s',
    '&:hover:enabled': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    '&:active:enabled': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.2)',
    },
    '&:focus:enabled': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.2)',
    },
    '&:disabled': {
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
    },
  },
});

interface MobileHeaderQuickActionButtonProps {
  disabled?: boolean;
  title: string;
  Icon: Icon;
  onClick?: () => void;
}

export const MobileHeaderQuickActionButton: FC<
  MobileHeaderQuickActionButtonProps
> = ({ disabled, title, Icon, onClick }) => {
  const styles = useStyles();

  return (
    <Button
      icon={<Icon size="inherit" />}
      disabled={disabled}
      appearance="transparent"
      style={{
        position: 'relative',
        minWidth: 'unset',
      }}
      className={styles.root}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

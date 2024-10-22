import { Button , makeStyles } from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';
import { FC } from 'react';

const useStyles = makeStyles({
  root: {
    color: 'rgba(255, 255, 255, 1) !important',
    background: 'rgba(0, 0, 0, 0)',
    transition: 'background 0.3s',
    '&:hover': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.2)',
    },
    '&:focus': {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(0, 0, 0, 0.2)',
    },
  },
});

interface QuickActionItemProps {
  label: string;
  Icon: Icon;
  link?: string;
  onClick?: () => void;
}

export const QuickActionItem: FC<QuickActionItemProps> = ({
  label,
  Icon,
  onClick,
  link,
}) => {
  const styles = useStyles();

  return (
    <Button
      icon={<Icon />}
      appearance="transparent"
      as="a"
      href={link}
      title={label}
      className={styles.root}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    />
  );
};

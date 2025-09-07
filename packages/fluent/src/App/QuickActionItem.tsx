import {
  Badge,
  BadgeProps,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useBasePath, useRouter } from '@headless-adminapp/app/route';
import { Icon } from '@headless-adminapp/icons';
import { FC } from 'react';

import { Button } from '../components/fluent';

const useStyles = makeStyles({
  root: {
    color: 'inherit !important',
    background: 'rgba(0, 0, 0, 0)',
    transition: 'background 0.3s',
    '&:hover': {
      color: 'inherit',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      color: 'inherit',
      background: 'rgba(0, 0, 0, 0.2)',
    },
    '&:focus': {
      color: 'inherit',
      background: 'rgba(0, 0, 0, 0.2)',
    },
  },
});

interface QuickActionItemProps {
  label: string;
  Icon: Icon;
  link?: string;
  onClick?: () => void;
  badgeCount?: number;
  badgeColor?: BadgeProps['color'];
  type?: 'button' | 'icon';
}

export const QuickActionItem: FC<QuickActionItemProps> = ({
  label,
  Icon,
  onClick,
  link,
  badgeCount,
  badgeColor = 'informative',
  type = 'icon',
}) => {
  const styles = useStyles();
  const router = useRouter();
  const basePath = useBasePath();

  const fullLink = link ? `${basePath}${link}` : undefined;

  return (
    <Button
      icon={
        <>
          <Icon size="inherit" />
          {!!badgeCount && (
            <Badge
              style={{ position: 'absolute', top: 0, right: 0 }}
              color={badgeColor}
              size="small"
            >
              {badgeCount}
            </Badge>
          )}
        </>
      }
      appearance="transparent"
      style={{
        position: 'relative',
        fontWeight: tokens.fontWeightRegular,
        minWidth: type === 'button' ? 'unset' : undefined,
      }}
      as="a"
      href={fullLink}
      title={label}
      aria-label={label}
      className={styles.root}
      onClick={async (event) => {
        event.preventDefault();

        if (fullLink) {
          await router.push(fullLink);
        } else if (onClick) {
          onClick();
        }
      }}
    >
      {type === 'button' ? label : ''}
    </Button>
  );
};

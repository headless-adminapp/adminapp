import {
  Badge,
  BadgeProps,
  Button,
  makeStyles,
} from '@fluentui/react-components';
import { useBasePath, useRouter } from '@headless-adminapp/app/route';
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
  badgeCount?: number;
  badgeColor?: BadgeProps['color'];
}

export const QuickActionItem: FC<QuickActionItemProps> = ({
  label,
  Icon,
  onClick,
  link,
  badgeCount,
  badgeColor = 'informative',
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
      style={{ position: 'relative' }}
      as="a"
      href={fullLink}
      title={label}
      className={styles.root}
      onClick={(event) => {
        event.preventDefault();

        if (fullLink) {
          router.push(fullLink);
        } else if (onClick) {
          onClick();
        }
      }}
    />
  );
};

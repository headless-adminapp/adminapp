import { Link, TableCell, tokens } from '@fluentui/react-components';
import { useRouter } from '@headless-adminapp/app/route/hooks';
import { type FC, memo, type PropsWithChildren } from 'react';

import type { CellDisplayType } from './TableCellBase';

export interface TableCellLinkProps {
  value: React.ReactNode | undefined | null;
  href?: string;
  onClick?: () => void;
  width?: number;
  target?: string;
  display?: CellDisplayType;
}

export const TableCellLink: FC<TableCellLinkProps> = memo(
  ({ value, href, onClick, width, target, display = 'flex' }) => {
    return (
      <TableCell
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width,
          minWidth: width,
          maxWidth: width,
          display,
          alignItems: 'center',
          height: '100%',
        }}
      >
        <TableCellLinkContent target={target} href={href} onClick={onClick}>
          {value}
        </TableCellLinkContent>
      </TableCell>
    );
  },
);

TableCellLink.displayName = 'TableCellLink';

interface TableCellLinkContentProps {
  target?: string;
  href?: string;
  onClick?: () => void;
}

export const TableCellLinkContent: FC<
  PropsWithChildren<TableCellLinkContentProps>
> = ({ children, target, href, onClick }) => {
  const router = useRouter();

  return (
    <Link
      as="a"
      href={href}
      target={target}
      onClick={(event) => {
        if (target === '_blank') {
          return;
        }

        if (event.metaKey || event.ctrlKey) {
          return;
        }

        if (onClick) {
          event.preventDefault();
          onClick();
          return;
        }

        if (href?.startsWith('/')) {
          void router.push(href);
          event.preventDefault();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
      }}
    >
      {children}
    </Link>
  );
};

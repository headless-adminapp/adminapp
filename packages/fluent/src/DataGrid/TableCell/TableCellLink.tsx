import { Link, TableCell, tokens } from '@fluentui/react-components';
import { useRouter } from '@headless-adminapp/app/route/hooks';
import { FC, memo } from 'react';

export interface TableCellLinkProps {
  value: React.ReactNode | undefined | null;
  href?: string;
  onClick?: () => void;
  width: number;
  target?: string;
}

export const TableCellLink: FC<TableCellLinkProps> = memo(
  ({ value, href, onClick, width, target }) => {
    const router = useRouter();

    return (
      <TableCell
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width,
          minWidth: width,
          maxWidth: width,
          display: 'flex',
          alignItems: 'center',
        }}
      >
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
              router.push(href);
              event.preventDefault();
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacingHorizontalXS,
          }}
        >
          {value}
        </Link>
      </TableCell>
    );
  }
);

TableCellLink.displayName = 'TableCellLink';

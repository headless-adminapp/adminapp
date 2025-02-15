import type { PropsWithChildren } from 'react';

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
  return <div>{children}</div>;
}

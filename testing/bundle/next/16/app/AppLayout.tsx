'use client';

import '@headless-adminapp/app/index.css';
import '@headless-adminapp/fluent/styles.css';
import 'react-quill/dist/quill.snow.css';
import { LayoutProvider } from '@headless-adminapp/fluent/App/LayoutProvider';
import { usePathname, useSearchParams } from 'next/navigation';
import { App } from '@headless-adminapp/fluent/App';
import { useNextRouter } from '@headless-adminapp/next';
import { PropsWithChildren } from 'react';

import { registerIconSet } from '@headless-adminapp/icons/register';
import { iconSet } from '@headless-adminapp/icons-fluent';

registerIconSet(iconSet);

export default function AppLayout({ children }: PropsWithChildren) {
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <LayoutProvider
      routeProps={{
        router: router,
        pathname: pathname,
        searchParams: searchParams,
        basePath: '/help-desk',
      }}
    >
      <App>{children}</App>
    </LayoutProvider>
  );
}

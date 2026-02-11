import { webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { useSystemColorScheme } from '@headless-adminapp/app/hooks/useSystemColorScheme';
import { SchemaExperienceStore } from '@headless-adminapp/app/store';
import { RestDataService } from '@headless-adminapp/app/transport/RestDataService';
import { SchemaStore } from '@headless-adminapp/core/store';
import { App } from '@headless-adminapp/fluent/App';
import { LayoutProvider } from '@headless-adminapp/fluent/App/LayoutProvider';
import { registerIconSet } from '@headless-adminapp/icons/register';
import { iconSet } from '@headless-adminapp/icons-fluent';
import { useNextRouter } from '@headless-adminapp/next';
import { usePathname, useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export const dataService = new RestDataService({
  endpoint: '/api/data',
});
export const clientSchemaStore = new SchemaStore();

export const clientExperienceStore = new SchemaExperienceStore({
  schemaStore: clientSchemaStore,
});

registerIconSet(iconSet);

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const systemColorScheme = useSystemColorScheme();

  const theme = systemColorScheme === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <LayoutProvider
      theme={theme}
      routeProps={{
        router,
        pathname: pathname ?? '',
        searchParams: searchParams as any,
      }}
      localeProps={{
        locale: 'en-IN',
        timezone: 'Asia/Calcutta',
        options: {
          currency: {
            currency: 'INR',
            currencyDisplay: 'narrowSymbol',
            currencySign: 'accounting',
          },
          dateFormats: {
            long: 'DD MMM YYYY',
            short: 'DD-MM-YYYY',
          },
          timeFormats: {
            short: 'hh:mm A',
          },
        },
      }}
      dataService={dataService}
      metadataProps={{
        experienceStore: clientExperienceStore,
        schemaStore: clientSchemaStore,
      }}
    >
      <App>{children}</App>
    </LayoutProvider>
  );
}

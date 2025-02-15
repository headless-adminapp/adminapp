import type { AppProps } from 'next/app';

import { AppLayout2 } from '../components/AppLayout';

function App({ Component, pageProps }: AppProps) {
  return (
    <AppLayout2 dehydratedState={pageProps.dehydratedState}>
      <Component {...pageProps} />
    </AppLayout2>
  );
}

export default App;

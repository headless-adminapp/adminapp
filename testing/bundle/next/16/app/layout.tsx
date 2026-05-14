import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const AppLayout = dynamic(() => import('./AppLayout'));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Admin App</title>
      </head>
      <body>
        <Suspense>
          <AppLayout>{children}</AppLayout>
        </Suspense>
      </body>
    </html>
  );
}

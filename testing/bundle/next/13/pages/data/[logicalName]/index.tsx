import { PageEntityView } from '@headless-adminapp/fluent/PageEntityView';

export default function Page({
  logicalName, // viewId,
}: Readonly<{
  logicalName: string;
  viewId: string | null;
}>) {
  return <PageEntityView logicalName={logicalName} />;
}

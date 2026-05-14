import type { ChangedValues } from '../ChangedValues';
import type { DatabaseContext } from '../DatabaseContext';
import type { ServerSdkContext } from '../sdk/ServerSdkContext';

export interface PluginActionParams<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data extends Record<string, any> = Record<string, any>,
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext,
> {
  data: Data;
  logicalName: string;
  id?: string | number;
  changedValues: ChangedValues<Data>;
  snapshot: Data;
  sdkContext: SdkContext;
  dbContext: DbContext;
}

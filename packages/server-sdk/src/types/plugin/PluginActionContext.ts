import { ChangedValues } from '../ChangedValues';
import { DatabaseContext } from '../DatabaseContext';
import { ServerSdkContext } from '../sdk/ServerSdkContext';

export interface PluginActionParams<
  Data extends Record<string, any> = Record<string, any>,
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext
> {
  data: Data;
  changedValues: ChangedValues<Data>;
  snapshot: Data;
  sdkContext: SdkContext;
  dbContext: DbContext;
}

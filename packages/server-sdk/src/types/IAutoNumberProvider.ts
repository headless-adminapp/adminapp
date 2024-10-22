import { DatabaseContext } from './DatabaseContext';
import { ServerSdkContext } from './sdk/ServerSdkContext';

export interface ResovleAutoNumberParams<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext
> {
  logicalName: string;
  attributeName: string;
  sdkContext: SdkContext;
  dbContext: DbContext;
  markAsUsed?: boolean;
}

export interface IAutoNumberProvider {
  resolveAutoNumber<T extends string | number = string>(
    params: ResovleAutoNumberParams
  ): Promise<T>;
}

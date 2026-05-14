import type { DatabaseContext } from '../DatabaseContext';
import type { ServerSdkContext } from '../sdk/ServerSdkContext';
import type { ExecutionStage } from './ExecutionStage';
import type { MessageName } from './MessageName';
import type { PluginActionParams } from './PluginActionContext';

export interface PluginStep<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data extends Record<string, any> = Record<string, any>,
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext,
> {
  logicalName: string;
  messageName: MessageName;
  stage: ExecutionStage;
  attributes?: Array<keyof Data>;
  action: (
    context: PluginActionParams<Data, SdkContext, DbContext>,
  ) => Promise<void>;
}

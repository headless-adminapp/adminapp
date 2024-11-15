import { DatabaseContext } from '../DatabaseContext';
import { ServerSdkContext } from '../sdk/ServerSdkContext';
import { ExecutionStage } from './ExecutionStage';
import { MessageName } from './MessageName';
import { PluginActionParams } from './PluginActionContext';

export interface PluginStep<
  Data extends Record<string, any> = Record<string, any>,
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext
> {
  logicalName: string;
  messageName: MessageName;
  stage: ExecutionStage;
  attributes?: Array<keyof Data>;
  action: (
    context: PluginActionParams<Data, SdkContext, DbContext>
  ) => Promise<void>;
}

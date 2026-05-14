import type { ChangedValues } from '../ChangedValues';
import type { DatabaseContext } from '../DatabaseContext';
import type { ServerSdkContext } from '../sdk/ServerSdkContext';
import type { ExecutionStage } from './ExecutionStage';
import type { MessageName } from './MessageName';
import type { PluginActionParams } from './PluginActionContext';

export interface ExecutePluginParams extends PluginActionParams {
  logicalName: string;
  id?: string | number;
  messageName: MessageName;
  stage: ExecutionStage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  changedValues: ChangedValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot: any;
  dbContext: DatabaseContext;
  sdkContext: ServerSdkContext;
}

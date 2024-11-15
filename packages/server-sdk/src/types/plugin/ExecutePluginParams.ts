import { ChangedValues } from '../ChangedValues';
import { DatabaseContext } from '../DatabaseContext';
import { ServerSdkContext } from '../sdk/ServerSdkContext';
import { ExecutionStage } from './ExecutionStage';
import { MessageName } from './MessageName';
import { PluginActionParams } from './PluginActionContext';

export interface ExecutePluginParams extends PluginActionParams {
  logicalName: string;
  id?: string | number;
  messageName: MessageName;
  stage: ExecutionStage;
  data: any;
  changedValues: ChangedValues;
  snapshot: any;
  dbContext: DatabaseContext;
  sdkContext: ServerSdkContext;
}

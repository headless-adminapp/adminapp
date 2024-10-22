import { DatabaseContext } from '../DatabaseContext';
import { ServerSdkContext } from '../sdk/ServerSdkContext';
import { ExecutePluginParams } from './ExecutePluginParams';
import { PluginStep } from './PluginStep';

export interface IPluginStore<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext
> {
  register<Data extends Record<string, any> = Record<string, any>>(
    plugin: PluginStep<Data, SdkContext, DbContext>
  ): void;

  execute(params: ExecutePluginParams): Promise<void>;
}

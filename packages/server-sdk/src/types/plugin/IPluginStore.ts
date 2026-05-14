import type { DatabaseContext } from '../DatabaseContext';
import type { ServerSdkContext } from '../sdk/ServerSdkContext';
import type { ExecutePluginParams } from './ExecutePluginParams';
import type { PluginStep } from './PluginStep';

export interface IPluginStore<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register<Data extends Record<string, any> = Record<string, any>>(
    plugin: PluginStep<Data, SdkContext, DbContext>,
  ): void;

  execute(params: ExecutePluginParams): Promise<void>;
}

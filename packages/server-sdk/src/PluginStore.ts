import { DatabaseContext } from './types/DatabaseContext';
import { ExecutePluginParams } from './types/plugin';
import { IPluginStore } from './types/plugin/IPluginStore';
import { MessageName } from './types/plugin/MessageName';
import { PluginStep } from './types/plugin/PluginStep';
import { ServerSdkContext } from './types/sdk/ServerSdkContext';

export class PluginStore<
  SdkContext extends ServerSdkContext = ServerSdkContext,
  DbContext extends DatabaseContext = DatabaseContext
> implements IPluginStore<SdkContext, DbContext>
{
  private readonly plugins: PluginStep[] = [];

  public register<Data extends Record<string, any> = Record<string, any>>(
    plugin: PluginStep<Data, SdkContext, DbContext>
  ) {
    this.plugins.push(plugin as PluginStep);
  }

  public async execute({
    logicalName,
    messageName,
    stage,
    data,
    changedValues,
    snapshot,
    ...rest
  }: ExecutePluginParams) {
    const steps = this.plugins.filter(
      (step) =>
        (!step.logicalName || step.logicalName === logicalName) &&
        step.messageName === messageName &&
        step.stage === stage
    );

    for (const step of steps) {
      if (
        messageName !== MessageName.Delete &&
        step.attributes?.length &&
        !Object.keys(changedValues).some((key) =>
          (step.attributes as unknown as string[]).includes(key)
        )
      ) {
        continue;
      }

      await step.action({
        data,
        changedValues,
        logicalName,
        snapshot,
        ...rest,
      });
    }
  }
}

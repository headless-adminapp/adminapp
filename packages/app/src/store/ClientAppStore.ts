import { AppExperience } from '@headless-adminapp/core/experience/app';
import { IClientAppStore } from '@headless-adminapp/core/store';

export class ClientAppStore implements IClientAppStore {
  private apps: Record<string, AppExperience> = {};

  public register(app: AppExperience): void {
    this.apps[app.id] = app;
  }

  public async getApp(id: string): Promise<AppExperience> {
    const app = this.apps[id];

    if (!app) {
      throw new Error(`App Experience for ${id} not found`);
    }

    return app;
  }
}

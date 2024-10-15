import { AppExperience } from '../experience/app';

export interface IClientAppStore {
  getApp: (id: string) => Promise<AppExperience>;
}

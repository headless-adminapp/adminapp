import { ExecuteParams } from './ExecuteParams';

export interface IServerSdk {
  execute(params: ExecuteParams): Promise<unknown>;
}

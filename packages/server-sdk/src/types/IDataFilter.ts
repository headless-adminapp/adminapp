import { Filter } from '@headless-adminapp/core/transport';

import { DatabaseContext } from './DatabaseContext';
import { ServerSdkContext } from './sdk/ServerSdkContext';

export interface GetOrganizationFilterParams<
  SdkContext extends ServerSdkContext,
  DbContext extends DatabaseContext
> {
  logicalName: string;
  sdkContext: SdkContext;
  dbContext: DbContext;
}

export interface GetPermissionFilterParams<
  SdkContext extends ServerSdkContext,
  DbContext extends DatabaseContext
> {
  logicalName: string;
  sdkContext: SdkContext;
  dbContext: DbContext;
}

export interface IDataFilter<
  SdkContext extends ServerSdkContext,
  DbContext extends DatabaseContext
> {
  getOrganizationFilter(
    params: GetOrganizationFilterParams<SdkContext, DbContext>
  ): Filter | null;
  getPermissionFilter(
    params: GetPermissionFilterParams<SdkContext, DbContext>
  ): Filter | null;
}

import { CommandContextBase } from '@headless-adminapp/core/experience/command';
import { useQueryClient } from '@tanstack/react-query';

import {
  useOpenAlertDialog,
  useOpenConfirmDialog,
  useOpenErrorDialog,
  useOpenPromptDialog,
} from '../../dialog/hooks';
import { useLocale } from '../../locale';
import { useMetadata } from '../../metadata/hooks';
import { useProgressIndicator } from '../../progress-indicator/hooks';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { useDataService } from '../../transport';
import { UtilityContextState } from '../types';

export function useUtility(): UtilityContextState {
  const { hideProgressIndicator, showProgressIndicator } =
    useProgressIndicator();
  const openAlertDialog = useOpenAlertDialog();
  const openConfirmDialog = useOpenConfirmDialog();
  const openErrorDialog = useOpenErrorDialog();
  const openPromptDialog = useOpenPromptDialog();
  const openToastNotification = useOpenToastNotification();

  return {
    hideProgressIndicator,
    showProgressIndicator,
    openAlertDialog,
    openConfirmDialog,
    openErrorDialog,
    openPromptDialog,
    showNotification: openToastNotification,
  };
}

export function useBaseCommandHandlerContext(): CommandContextBase {
  const dataService = useDataService();
  const queryClient = useQueryClient();
  const stores = useMetadata();
  const utility = useUtility();
  const locale = useLocale();

  return {
    dataService,
    queryClient,
    utility,
    stores,
    locale,
  };
}

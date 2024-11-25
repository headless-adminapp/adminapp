import { useOpenForm } from '@headless-adminapp/app/navigation';
import { CommandContextBase } from '@headless-adminapp/core/experience/command';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

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

  return useMemo(
    () => ({
      hideProgressIndicator,
      showProgressIndicator,
      openAlertDialog,
      openConfirmDialog,
      openErrorDialog,
      openPromptDialog,
      showNotification: openToastNotification,
    }),
    [
      hideProgressIndicator,
      openAlertDialog,
      openConfirmDialog,
      openErrorDialog,
      openPromptDialog,
      openToastNotification,
      showProgressIndicator,
    ]
  );
}

function useNavigation() {
  const openForm = useOpenForm();

  return useMemo(
    () => ({
      openForm,
    }),
    [openForm]
  );
}

export function useBaseCommandHandlerContext(): CommandContextBase {
  const dataService = useDataService();
  const queryClient = useQueryClient();
  const stores = useMetadata();
  const utility = useUtility();
  const locale = useLocale();
  const navigation = useNavigation();

  return useMemo(
    () => ({
      dataService,
      queryClient,
      utility,
      stores,
      locale,
      navigation,
    }),
    [dataService, queryClient, stores, utility, locale, navigation]
  );
}

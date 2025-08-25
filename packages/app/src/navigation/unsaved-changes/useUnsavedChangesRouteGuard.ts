import { useOpenConfirmDialog } from '@headless-adminapp/app/dialog';
import { useRouter } from '@headless-adminapp/app/route';
import { useEffect } from 'react';

import {
  getUnsavedChangesInfo,
  setUnsavedChangesInfo,
} from './unsavedChangesInfo';

export function useUnsavedChangesRouteGuard() {
  const router = useRouter();
  const openConfirmDialog = useOpenConfirmDialog();

  useEffect(() => {
    const guard = async () => {
      const unsavedChangesInfo = getUnsavedChangesInfo();

      if (!unsavedChangesInfo) {
        return true;
      }

      const confirmResult = await openConfirmDialog({
        title: unsavedChangesInfo.title,
        text: unsavedChangesInfo.message,
        confirmButtonLabel: 'Leave',
        cancelButtonLabel: 'Stay',
      });

      if (!confirmResult?.confirmed) {
        return false;
      }

      setUnsavedChangesInfo(null);
      return true;
    };

    router.registerGuard(guard);

    return () => {
      router.unregisterGuard(guard);
    };
  }, [router, openConfirmDialog]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      const unsavedChangesInfo = getUnsavedChangesInfo();
      if (unsavedChangesInfo) {
        event.preventDefault();
        event.returnValue = unsavedChangesInfo.message;
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}

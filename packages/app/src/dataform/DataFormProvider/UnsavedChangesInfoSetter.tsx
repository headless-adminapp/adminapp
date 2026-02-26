import { setUnsavedChangesInfo } from '@headless-adminapp/app/navigation/unsaved-changes';
import { FC, useEffect } from 'react';

import { useFormIsDirty } from '../hooks';

export const UnsavedChangesInfoSetter: FC = () => {
  const isDirty = useFormIsDirty();

  useEffect(() => {
    if (!isDirty) {
      setUnsavedChangesInfo(null);
    } else {
      setUnsavedChangesInfo({
        title: 'Unsaved Changes',
        message:
          'You have unsaved changes. Are you sure you want to leave without saving?',
      });
    }

    return () => {
      setUnsavedChangesInfo(null);
    };
  }, [isDirty]);

  return null;
};

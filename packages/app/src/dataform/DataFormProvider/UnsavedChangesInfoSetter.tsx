import { setUnsavedChangesInfo } from '@headless-adminapp/app/navigation/unsaved-changes';
import { FC, useEffect } from 'react';

import { useFormInstance } from '../hooks';

export const UnsavedChangesInfoSetter: FC = () => {
  const form = useFormInstance();

  useEffect(() => {
    if (!form.formState.isDirty) {
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
  }, [form.formState.isDirty]);

  return null;
};

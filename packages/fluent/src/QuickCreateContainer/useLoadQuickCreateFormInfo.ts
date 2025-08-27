import { useExperienceStore, useSchema } from '@headless-adminapp/app/metadata';
import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema } from '@headless-adminapp/core/schema';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type UseLoadMainFormPageResult =
  | {
      loading: true;
    }
  | {
      loading: false;
      error: true;
      title: string;
      message: string;
    }
  | {
      loading: false;
      error: false;
      schema: Schema;
      form: Form;
      commands: EntityMainFormCommandItemExperience[][];
    };

export function useLoadQuickCreateFormInfo(
  logicalName: string,
  formId: string | undefined
): UseLoadMainFormPageResult {
  const schema = useSchema(logicalName);
  const experienceStore = useExperienceStore();

  const { data: form, isFetching: isFetchingForm } = useQuery({
    queryKey: ['experience-schema-quick-create-form', logicalName, formId],
    queryFn: async () => {
      return experienceStore.getQuickCreateForm(logicalName, formId);
    },
    placeholderData: keepPreviousData,
  });

  const { data: commands } = useQuery({
    queryKey: ['experience-schema-form-commands', logicalName],
    queryFn: async () => {
      return [];
    },
    initialData: [],
  });

  if (!schema) {
    return {
      loading: false,
      error: true,
      title: 'Schema not found',
      message: `The schema "${logicalName}" was not found`,
    };
  }

  if (!form) {
    if (isFetchingForm) {
      return {
        loading: true,
      };
    }

    return {
      loading: false,
      error: true,
      title: 'Form not found',
      message: `The form was not found for "${logicalName}"`,
    };
  }

  if (form.logicalName !== schema.logicalName) {
    if (isFetchingForm) {
      return {
        loading: true,
      };
    }

    return {
      loading: false,
      error: true,
      title: 'Form not found',
      message: 'The form was not found (missmatch)',
    };
  }

  return {
    loading: false,
    error: false,
    schema,
    form,
    commands,
  };
}

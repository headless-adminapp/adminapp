import { Body1Strong, Divider } from '@fluentui/react-components';
import {
  editableSubgridFormValidator,
  useEventManager,
  useFormInstance,
  useRecordId,
} from '@headless-adminapp/app/dataform';
import { EVENT_KEY_ON_FIELD_CHANGE } from '@headless-adminapp/app/dataform/constants';
import { getEditableSubgridRecords } from '@headless-adminapp/app/dataform/DataFormProvider/getRecord';
import { saveEditableGridControl } from '@headless-adminapp/app/dataform/utils/saveRecord';
import { useFormValidationStrings } from '@headless-adminapp/app/form';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata';
import { useDataService } from '@headless-adminapp/app/transport';
import { SectionEditableGridControl } from '@headless-adminapp/core/experience/form';
import { Icons } from '@headless-adminapp/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { BodyLoading } from '../../components/BodyLoading';
import { Button } from '../../components/fluent';
import { CardUi } from './CardUi';
import { TableUi } from './TableUi';

interface EditableGridControlProps {
  readOnly?: boolean;
  control: SectionEditableGridControl;
}

export function EditableGridControl({
  readOnly,
  control,
}: Readonly<EditableGridControlProps>) {
  const recordId = useRecordId();
  const dataService = useDataService();

  const isMobile = useIsMobile();

  const { schemaStore } = useMetadata();
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const schema = schemaStore.getSchema(control.logicalName);

  const alias = control.alias ? control.alias : 'items';

  const parentFormInstance = useFormInstance();

  const localFormInstance = useForm<any>({
    mode: 'all',
    defaultValues: {
      items: [],
    },
    resolver: editableSubgridFormValidator({
      alias,
      control,
      schema: schemaStore.getSchema(control.logicalName),
      language,
      region,
      schemaStore,
      strings: formValidationStrings,
      formReadOnly: readOnly,
    }),
    shouldUnregister: false,
  });

  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ['editable-grid', recordId, control],
    queryFn: async () => {
      return getEditableSubgridRecords({
        control,
        schemaStore,
        dataService,
        recordId,
      });
    },
    enabled: !!recordId && !control.alias,
  });

  const eventManager = useEventManager();

  const formInstanceRef = useRef(localFormInstance);
  formInstanceRef.current = localFormInstance;

  useEffect(() => {
    if (!data) {
      return;
    }

    formInstanceRef.current.reset({
      items: data,
    });
  }, [data]);

  const formControl = control.alias
    ? parentFormInstance.control
    : localFormInstance.control;

  const fieldArray = useFieldArray({
    control: formControl,
    name: alias,
    keyName: '__key',
    shouldUnregister: false,
  });

  const handleAddRow = () => {
    const newItem: Record<string, unknown> = {
      $entity: schema.logicalName,
      [schema.idAttribute]: null,
      [control.associatedAttribute]: {
        id: recordId,
      },
    };

    control.controls.forEach((control) => {
      if (typeof control === 'string') {
        newItem[control] = null;
      } else {
        newItem[control.attributeName] = null;
      }
    });

    fieldArray.append(newItem);
    eventManager.emit(
      EVENT_KEY_ON_FIELD_CHANGE,
      `${alias}.${fieldArray.fields.length}`,
      newItem,
      null
    );
  };

  const handleSave = async () => {
    await localFormInstance.handleSubmit(
      async (values) => {
        try {
          await saveEditableGridControl({
            recordId,
            values,
            initialValues: localFormInstance.formState.defaultValues,
            control,
            dataService,
            schemaStore,
            alias,
          });

          await queryClient.invalidateQueries({
            queryKey: ['editable-grid', recordId, control],
          });
        } catch (error) {
          console.error(error);
        }
      },
      (errors) => {
        console.error(errors);
      }
    )();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          paddingInline: 16,
          paddingBlock: 8,
          height: 40,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Body1Strong>{control.label}</Body1Strong>
          <div style={{ flex: 1 }} />
          <div style={{ marginRight: -12 }}>
            {!control.alias && !readOnly && (
              <Button
                icon={<Icons.Save />}
                appearance="subtle"
                style={{ minWidth: 0 }}
                disabled={
                  localFormInstance.formState.isSubmitting ||
                  !localFormInstance.formState.isValid ||
                  !localFormInstance.formState.isDirty
                }
                onClick={handleSave}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
      <div>
        <Divider style={{ opacity: 0.2 }} />
      </div>
      <div style={{ padding: 16, position: 'relative' }}>
        {!isMobile &&
        control.format === 'grid' &&
        control.controls.length < 10 ? (
          <TableUi
            schema={schema}
            control={control}
            formControl={formControl}
            alias={alias}
            onAddRow={handleAddRow}
            onRemoveRow={(index) => {
              const previousValue = fieldArray.fields[index];
              fieldArray.remove(index);
              eventManager.emit(
                EVENT_KEY_ON_FIELD_CHANGE,
                `${alias}.${index}`,
                null,
                previousValue
              );
            }}
            rows={fieldArray.fields}
            readOnly={readOnly}
          />
        ) : (
          <CardUi
            schema={schema}
            control={control}
            formControl={formControl}
            alias={alias}
            onAddRow={handleAddRow}
            onRemoveRow={(index) => {
              const previousValue = fieldArray.fields[index];
              fieldArray.remove(index);
              eventManager.emit(
                EVENT_KEY_ON_FIELD_CHANGE,
                `${alias}.${index}`,
                null,
                previousValue
              );
            }}
            rows={fieldArray.fields}
            readOnly={readOnly}
          />
        )}
      </div>
      <BodyLoading
        loading={isFetching || localFormInstance.formState.isSubmitting}
      />
    </div>
  );
}

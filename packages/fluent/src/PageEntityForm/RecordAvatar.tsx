import { Avatar, SkeletonItem, tokens } from '@fluentui/react-components';
import { useAppContext } from '@headless-adminapp/app/app';
import { DataFormContext } from '@headless-adminapp/app/dataform';
import {
  useDataFormSchema,
  useRecordId,
  useRecordTitle,
} from '@headless-adminapp/app/dataform/hooks';
import { useIsFormDataFetching } from '@headless-adminapp/app/dataform/hooks/useIsDataFetching';
import { useOpenErrorDialog } from '@headless-adminapp/app/dialog';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useProgressIndicator } from '@headless-adminapp/app/progress-indicator';
import {
  useDataService,
  useFileService,
} from '@headless-adminapp/app/transport';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { IconPlaceholder, Icons } from '@headless-adminapp/icons';
import { FC, useState } from 'react';

import { getAvatarColor } from '../utils/avatar';
import { UploadImageDialog } from './UploadImageDialog';

export const RecordAvatar: FC = () => {
  const [recordTitle, isPlaceholder] = useRecordTitle();
  const schema = useDataFormSchema();
  const record = useContextSelector(DataFormContext, (state) => state.record);
  const recordId = useRecordId();
  const { schemaMetadataDic } = useAppContext();
  const dataService = useDataService();
  const refresh = useContextSelector(DataFormContext, (state) => state.refresh);
  const [showAvatarChangeDialog, setShowAvatarChangeDialog] = useState(false);
  const isDataFetching = useIsFormDataFetching();

  const fileService = useFileService();

  const { showProgressIndicator, hideProgressIndicator } =
    useProgressIndicator();
  const openErrorDialog = useOpenErrorDialog();

  if (!schema.avatarAttribute) {
    return null;
  }

  const avatarAttribute = schema.attributes[schema.avatarAttribute];

  if (avatarAttribute?.type !== 'attachment') {
    return null;
  }

  const value = record?.[schema.avatarAttribute] as FileObject;

  const handleChange = async (value: FileObject | null) => {
    if (!recordId) {
      return;
    }

    try {
      showProgressIndicator();

      await dataService.updateRecord(schema.logicalName, recordId, {
        [schema.avatarAttribute!]: value,
      });

      await refresh();
    } catch {
      openErrorDialog({
        title: 'Error',
        text: 'Unable to update record',
      });
    } finally {
      hideProgressIndicator();
    }
  };

  const experienceSchema = schemaMetadataDic[schema.logicalName];

  if (!experienceSchema) {
    return null;
  }

  if (isDataFetching) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginRight: tokens.spacingHorizontalM,
          marginTop: 2,
        }}
      >
        <SkeletonItem
          style={{
            width: 36,
            height: 36,
            borderRadius: tokens.borderRadiusCircular,
          }}
        />
      </div>
    );
  }

  if (isPlaceholder && !value) {
    const Icon = experienceSchema.Icon ?? Icons.Entity ?? IconPlaceholder;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginRight: tokens.spacingHorizontalM,
          marginTop: 2,
        }}
      >
        <Avatar style={{ width: 36, height: 36 }} icon={<Icon size={20} />} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginRight: tokens.spacingHorizontalM,
        marginTop: 2,
      }}
    >
      <Avatar
        style={{ width: 36, height: 36 }}
        name={recordTitle}
        color={getAvatarColor(recordTitle)}
        image={{
          src: value?.url,
        }}
        onClick={() => {
          if (!fileService) {
            return;
          }

          setShowAvatarChangeDialog(true);
        }}
      />
      {!!recordId && !!fileService && (
        <UploadImageDialog
          recordTitle={recordTitle}
          currentImage={value}
          onChange={handleChange}
          recordId={recordId}
          open={showAvatarChangeDialog}
          onOpenChange={(open) => setShowAvatarChangeDialog(open)}
        />
      )}
    </div>
  );
};

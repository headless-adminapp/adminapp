import {
  Body1,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  tokens,
} from '@fluentui/react-components';
import {
  useOpenConfirmDialog,
  useOpenErrorDialog,
} from '@headless-adminapp/app/dialog/hooks';
import {
  AttachmentAttribute,
  FileObject,
} from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { IFileService } from '@headless-adminapp/core/transport';
import { fileToObject, urlToFileObject } from '@headless-adminapp/core/utils';
import { Icons } from '@headless-adminapp/icons';
import { useMutation } from '@tanstack/react-query';
import { FC, useMemo } from 'react';

import { ControlProps } from './types';

interface UseAttachmentSelectorOptions {
  fileService: IFileService | null; // required for remote location
  fileServiceContext?: Record<string, unknown>;
  location: AttachmentAttribute['location'];
  onChange?: (fileObject: FileObject) => void | Promise<void>;
}

export function useAttachmentSelector({
  fileService,
  fileServiceContext,
  location,
  onChange,
}: UseAttachmentSelectorOptions) {
  const openErrorDialog = useOpenErrorDialog();

  const { isPending, mutate: handleFile } = useMutation({
    mutationFn: async (file: File) => {
      if (location === 'local') {
        return fileToObject(file);
      } else {
        if (!fileService) {
          throw new Error('File service is not provided');
        }

        const url = await fileService.uploadFile(file, {
          context: fileServiceContext,
        });

        return urlToFileObject(url);
      }
    },
    onSuccess: async (fileObject: FileObject) => {
      await onChange?.(fileObject);
    },
    onError: (error) => {
      console.error(error);
      openErrorDialog({
        title: 'Failed to upload file',
        text: error.message,
      });
    },
  });

  const selectFile = (accept: string) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (accept) {
      input.accept = accept;
    }

    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;

      if (!files?.length) {
        return;
      }

      const file = files[0];

      handleFile(file);
    };

    input.click();
  };

  return {
    isProcessing: isPending,
    selectFile,
  };
}

export interface AttachmentImageControlProps extends ControlProps<FileObject> {
  fileService: IFileService | null;
  fileServiceContext?: Record<string, unknown>;
  location: AttachmentAttribute['location'];
}

const AttachmentImageControl: FC<AttachmentImageControlProps> = ({
  value,
  disabled,
  readOnly,
  onChange,
  fileService,
  fileServiceContext,
  location,
}) => {
  const { isProcessing, selectFile } = useAttachmentSelector({
    fileService,
    fileServiceContext,
    location,
    onChange,
  });

  if (!value) {
    return (
      <div style={{ position: 'relative', display: 'flex' }}>
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: tokens.colorNeutralBackground2,
            borderRadius: tokens.borderRadiusMedium,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: tokens.colorNeutralForeground4,
            cursor: 'pointer',
            pointerEvents:
              disabled || readOnly || isProcessing ? 'none' : 'auto',
          }}
          onClick={() => selectFile('image/*')}
        >
          {isProcessing ? <Spinner size="small" /> : <Icons.Image />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      <div
        style={{
          maxWidth: '100%',
          height: 100,
          position: 'relative',
        }}
      >
        <img
          src={value.url}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: tokens.borderRadiusMedium,
          }}
        />
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <ActionMenu
            format={'image'}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            onChangeClick={() => selectFile('image/*')}
          />
        </div>
        {isProcessing && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: tokens.colorNeutralBackground1,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner size="small" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface AttachmentControlProps extends ControlProps<FileObject> {
  fileService: IFileService | null;
  fileServiceContext?: Record<string, unknown>;
  location: AttachmentAttribute['location'];
  format: AttachmentAttribute['format'];
}

export const AttachmentControl: FC<AttachmentControlProps> = ({
  value,
  disabled,
  readOnly,
  id,
  name,
  onBlur,
  onChange,
  placeholder,
  fileService,
  fileServiceContext,
  location,
  format,
}) => {
  const { isProcessing, selectFile } = useAttachmentSelector({
    fileService,
    fileServiceContext,
    location,
    onChange,
  });

  const accept = useMemo(() => {
    switch (format) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'document':
        return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv';
      default:
        return '';
    }
  }, [format]);

  const FormatIcon = useMemo(() => {
    switch (format) {
      case 'video':
        return Icons.Video;
      case 'audio':
        return Icons.Audio;
      default:
        return Icons.Document;
    }
  }, [format]);

  if (format === 'image') {
    return (
      <AttachmentImageControl
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        fileService={fileService}
        fileServiceContext={fileServiceContext}
        location={location}
      />
    );
  }

  if (!value) {
    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 30,
              borderRadius: tokens.borderRadiusMedium,
              backgroundColor: tokens.colorNeutralBackground2,
              display: 'flex',
              paddingLeft: tokens.spacingHorizontalS,
              gap: tokens.spacingHorizontalS,
              alignItems: 'center',
              overflow: 'hidden',
              color: tokens.colorNeutralForeground4,
              cursor: 'pointer',
              pointerEvents:
                disabled || readOnly || isProcessing ? 'none' : 'auto',
            }}
            onClick={() => selectFile(accept)}
          >
            <FormatIcon size={16} />
            <Body1
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {placeholder || 'Select a file'}
            </Body1>
            {isProcessing && (
              <div style={{ paddingRight: tokens.spacingHorizontalS }}>
                <Spinner size="extra-tiny" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: 30,
            borderRadius: tokens.borderRadiusMedium,
            backgroundColor: tokens.colorNeutralBackground2,
            display: 'flex',
            paddingLeft: tokens.spacingHorizontalS,
            gap: tokens.spacingHorizontalS,
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <FormatIcon size={16} />
          <Body1
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {value.name || value.url}
          </Body1>
          {isProcessing && (
            <div style={{ paddingRight: tokens.spacingHorizontalS }}>
              <Spinner size="extra-tiny" />
            </div>
          )}
          {!isProcessing && (
            <ActionMenu
              format={format}
              value={value}
              disabled={disabled}
              readOnly={readOnly}
              onChange={onChange}
              onChangeClick={() => selectFile(accept)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface ActionMenuProps {
  value: FileObject;
  format: AttachmentAttribute['format'];
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (fileObject: FileObject | null) => void;
  onChangeClick?: () => void;
}

const ActionMenu: FC<ActionMenuProps> = ({
  format,
  value,
  disabled,
  readOnly,
  onChange,
  onChangeClick,
}) => {
  const openConfirmDialog = useOpenConfirmDialog();

  const FileOpenIcon = useMemo(() => {
    switch (format) {
      case 'video':
      case 'audio':
        return Icons.Play;
      default:
        return Icons.OpenInNew;
    }
  }, [format]);

  const OpenText = useMemo(() => {
    switch (format) {
      case 'video':
        return 'Play';
      case 'audio':
        return 'Play';
      default:
        return 'Open';
    }
  }, [format]);

  return (
    <Menu positioning="before-top" hasIcons>
      <MenuTrigger>
        <Button appearance="transparent" icon={<Icons.MoreVertical />} />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<FileOpenIcon />}
            onClick={() => {
              window.open(value.url, '_blank');
            }}
          >
            {OpenText}
          </MenuItem>
          <MenuItem
            icon={<Icons.Copy />}
            onClick={() => {
              navigator.clipboard.writeText(value.url).catch(() => {});
            }}
          >
            Copy Url
          </MenuItem>
          {!(disabled || readOnly) && (
            <>
              <MenuItem
                icon={<Icons.Edit />}
                onClick={() => {
                  onChangeClick?.();
                }}
              >
                Change
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<Icons.Delete />}
                onClick={async () => {
                  const result = await openConfirmDialog({
                    title: 'Remove file',
                    text: 'Are you sure you want to remove this file?',
                    confirmButtonLabel: 'Remove',
                    cancelButtonLabel: 'Cancel',
                  });

                  if (!result?.confirmed) {
                    return;
                  }

                  onChange?.(null);
                }}
              >
                Remove
              </MenuItem>
            </>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

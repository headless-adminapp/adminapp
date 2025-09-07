import {
  Avatar,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  tokens,
} from '@fluentui/react-components';
import { useDataFormSchema } from '@headless-adminapp/app/dataform/hooks';
import { useOpenErrorDialog } from '@headless-adminapp/app/dialog';
import { useFileService } from '@headless-adminapp/app/transport';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { readFileAsDataURL } from '@headless-adminapp/core/utils';
import { Icons } from '@headless-adminapp/icons';
import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';

import { Button, DialogSurface } from '../components/fluent';
import { getAvatarColor } from '../utils/avatar';

interface UploadImageDialogProps {
  recordId: string;
  recordTitle: string;
  currentImage: FileObject | null;
  onChange?: (value: FileObject | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadImageDialog: FC<UploadImageDialogProps> = ({
  currentImage,
  recordTitle,
  recordId,
  onChange,
  open,
  onOpenChange,
}) => {
  const schema = useDataFormSchema();
  const fileService = useFileService();
  const [file, setFile] = useState<File | null>(null); // new file (indicate if file is changed)
  const [fileUrl, setFileUrl] = useState<string | null>(null); // file url, indicate that file is either selected or changed
  const openErrorDialog = useOpenErrorDialog();

  useEffect(() => {
    setFileUrl(currentImage?.url ?? null);
  }, [currentImage?.url]);

  const handleSelectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) {
        return;
      }

      const _file = files[0];
      setFile(_file);
      const dataUrl = await readFileAsDataURL(_file);
      setFileUrl(dataUrl);
    };

    input.click();
  };

  const { isPending, mutate: handleApply } = useMutation({
    mutationFn: async () => {
      if (!fileService) {
        throw new Error('File service is not available');
      }

      if (file) {
        const url = await fileService.uploadFile(file, {
          context: {
            type: 'entity-form',
            recordId,
            attributeName: schema.avatarAttribute!,
            logicalName: schema.logicalName,
          },
        });

        onChange?.({
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        });
      } else {
        onChange?.(null);
      }

      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);

      openErrorDialog({
        title: 'Error',
        text: 'Unable to upload image',
      });
    },
  });

  // No image - No image selected - Upload Image
  // No image - Image selected - Change, Cancel
  // Image - Not changed - Upload Image, Use Default
  // Image - Removed - Change, Cancel
  // Image - Changed - Change, Cancel

  const isFileChanged = (fileUrl ?? null) !== (currentImage?.url ?? null);

  const showUploadImage = !isFileChanged;
  const showChangeImage = !!isFileChanged;
  const showResetImage = !isFileChanged && !!fileUrl;
  const showCancel = isFileChanged;

  return (
    <Dialog open={open} onOpenChange={(e, data) => onOpenChange(data.open)}>
      <DialogSurface style={{ maxWidth: 480 }}>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<Icons.Close />}
                />
              </DialogTrigger>
            }
          >
            Choose Image
          </DialogTitle>
          <DialogContent>
            <div>
              <div>
                Upload an image from your device, or use the default image
              </div>
              <div
                style={{
                  marginTop: tokens.spacingVerticalM,
                  marginBottom: tokens.spacingVerticalM,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  shape="square"
                  style={{ width: 120, height: 120 }}
                  name={recordTitle}
                  color={getAvatarColor(recordTitle)}
                  image={{
                    src: fileUrl ?? undefined,
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            {showChangeImage && (
              <Button
                appearance="primary"
                onClick={() => handleApply()}
                style={{
                  whiteSpace: 'nowrap',
                  fontWeight: 'normal',
                }}
                disabled={isPending}
              >
                {isPending ? 'Changing...' : 'Change'}
              </Button>
            )}
            {showUploadImage && (
              <Button
                appearance="primary"
                onClick={handleSelectFile}
                style={{
                  whiteSpace: 'nowrap',
                  // minWidth: 0,
                  fontWeight: 'normal',
                }}
              >
                Upload Image
              </Button>
            )}
            {showResetImage && (
              <Button
                style={{
                  whiteSpace: 'nowrap',
                  // minWidth: 0,
                  fontWeight: 'normal',
                }}
                onClick={() => {
                  setFileUrl(null);
                  setFile(null);
                }}
              >
                Reset to Default
              </Button>
            )}
            {showCancel && (
              <Button
                appearance="secondary"
                style={{
                  whiteSpace: 'nowrap',
                  // minWidth: 0,
                  fontWeight: 'normal',
                }}
                onClick={() => {
                  setFileUrl(currentImage?.url ?? null);
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

import {
  Button,
  Caption1,
  Link,
  Tag,
  TagGroup,
  TagPicker,
  TagPickerControl,
  TagPickerList,
  tokens,
} from '@fluentui/react-components';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { fileToObject } from '@headless-adminapp/core/utils';
import { Icons } from '@headless-adminapp/icons';
import { FC, useRef } from 'react';

import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export interface AttachmentsControlProps extends ControlProps<FileObject[]> {}

export const AttachmentsControl: FC<AttachmentsControlProps> = ({
  onChange,
  id,
  onBlur,
  onFocus,
  disabled,
  readOnly,
  value,
  skeleton,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TagPicker appearance="filled-darker" disabled={disabled} open={false}>
        <TagPickerControl
          onFocus={onFocus}
          onBlur={onBlur}
          id={id}
          style={{ paddingBlock: tokens.spacingVerticalXXS }}
          expandIcon={null}
        >
          <TagGroup
            style={{
              flexWrap: 'wrap',
              columnGap: tokens.spacingHorizontalXS,
              gap: tokens.spacingHorizontalXS,
            }}
          >
            {value?.map((file, index) => (
              <Tag
                key={index}
                as="span"
                appearance="brand"
                size="small"
                shape="rounded"
                dismissible={!disabled && !readOnly}
                dismissIcon={
                  <div
                    style={{ display: 'flex', cursor: 'pointer' }}
                    onClick={() => {
                      if (disabled || readOnly) return;
                      onChange?.(value?.filter((_, i) => i !== index));
                    }}
                  >
                    <Icons.Close size={16} />
                  </div>
                }
              >
                <Link
                  href={file.url}
                  target="_blank"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(file.url, '_blank');
                  }}
                >
                  <Caption1
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {file.name}
                  </Caption1>
                </Link>
              </Tag>
            ))}
            {!readOnly && !disabled && (
              <Button
                size="small"
                icon={<Icons.Add size={16} />}
                appearance="outline"
                onClick={() => {
                  if (readOnly) return;
                  inputRef.current?.click();
                }}
              >
                Add
              </Button>
            )}
          </TagGroup>
        </TagPickerControl>
        <TagPickerList />
      </TagPicker>
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={async (event) => {
          const files = event.target.files;

          if (files?.length) {
            const fileObjects = await Promise.all(
              Array.from(files).map((file) => fileToObject(file))
            );
            onChange?.([...(value ?? []), ...fileObjects]);
          }
        }}
      />
    </div>
  );
};

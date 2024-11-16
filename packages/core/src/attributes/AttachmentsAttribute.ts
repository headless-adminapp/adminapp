import { FileObject } from './AttachmentAttribute';
import { AttributeBase } from './AttributeBase';

export type AttachmentsAttribute<T extends FileObject | string> = AttributeBase<
  T[]
> & {
  type: 'attachments';
  format: 'image' | 'video' | 'audio' | 'document' | 'any';
  maxSize?: number; // in bytes
} & ({ asObject: boolean } | { asBase64: boolean } | { asUrl: boolean });

import { FileObject } from './AttachmentAttribute';
import { AttributeBase } from './AttributeBase';

export type AttachmentsAttribute = AttributeBase<FileObject[]> & {
  type: 'attachments';
  format: 'image' | 'video' | 'audio' | 'document' | 'any';
  maxSize?: number; // in bytes
  location?: 'local' | 'cloud'; // default is local (local = base64 url, cloud = http url)
};

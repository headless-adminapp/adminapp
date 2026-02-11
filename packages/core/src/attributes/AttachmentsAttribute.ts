import { FileObject } from './AttachmentAttribute';
import { AttributeBase } from './AttributeBase';

/**
 * Attachments attribute type
 * @description Represents an attachments attribute that can hold multiple file objects.
 * */
export type AttachmentsAttribute = AttributeBase<FileObject[]> & {
  type: 'attachments';
  format:
    | 'image' // images only
    | 'video' // videos only
    | 'audio' // audios only
    | 'document' // documents only
    | 'any'; // any type of file
  maxSize?: number; // in bytes
  location?: 'local' | 'cloud'; // default is local (local = base64 url, cloud = http url)
};

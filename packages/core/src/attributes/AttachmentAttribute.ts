import { AttributeBase } from './AttributeBase';

export interface FileObject {
  name: string;
  size: number;
  type: string;
  url: string; // http url or base64 url
}

/**
 * Attachment attribute type
 * @description Represents a single attachment attribute that holds a file object.
 * */
export type AttachmentAttribute = AttributeBase<FileObject> & {
  type: 'attachment';
  format:
    | 'image' // images only
    | 'video' // videos only
    | 'audio' // audios only
    | 'document' // documents only
    | 'url' // any type of file represented by a url
    | 'any'; // any type of file
  maxSize?: number; // in bytes
  location?: 'local' | 'cloud'; // default is local (local = base64 url, cloud = http url)
};

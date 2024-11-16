import { AttributeBase } from './AttributeBase';

export interface FileObject {
  name: string;
  size: number;
  type: string;
  url: string; // http url or base64 url
}

export type AttachmentAttribute = AttributeBase<FileObject> & {
  type: 'attachment';
  format: 'image' | 'video' | 'audio' | 'document' | 'any';
  maxSize?: number; // in bytes
  location?: 'local' | 'cloud'; // default is local (local = base64 url, cloud = http url)
};

import { AttributeBase } from './AttributeBase';

export type AttachmentAttribute = AttributeBase<string> & {
  type: 'attachment';
  format: 'image' | 'video' | 'audio' | 'document' | 'any';
  maxSize?: number; // in bytes
};

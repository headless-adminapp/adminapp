import { AttributeBase } from './AttributeBase';

export interface FileObject {
  name: string;
  size: number;
  type: string;
  data: string; // base64
}

export type AttachmentAttribute<
  T extends FileObject | string = FileObject | string
> = AttributeBase<T> & {
  type: 'attachment';
  format: 'image' | 'video' | 'audio' | 'document' | 'any';
  maxSize?: number; // in bytes
} & ({ asObject: boolean } | { asBase64: boolean } | { asUrl: boolean });

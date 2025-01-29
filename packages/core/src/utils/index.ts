import { v4 as uuid } from 'uuid';

import { FileObject } from '../attributes/AttachmentAttribute';
import { ItemWithKey } from '../types';

export function typeSafeFn<T>() {
  return function <U extends T>(a: U): U {
    return a;
  };
}

export function fileToObject(file: File): Promise<FileObject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        url: reader.result as string,
      });
    };
    reader.onerror = (error) => {
      console.error(error);
      reject(new Error(`Error reading file: ${file.name}`));
    };
    reader.readAsDataURL(file);
  });
}

export function dataUrlToFile(dataUrl: string, name: string): File {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], name, { type: mimeString });
}

export function urlToFileObject(url: string, name?: string): FileObject {
  const fileName = name || url.split('/').pop() || 'file';

  return {
    name: fileName,
    size: 0,
    type: '',
    url,
  };
}

export function createItemWithKey<T>(value: T): ItemWithKey<T> {
  return {
    ...value,
    __key: uuid(),
  };
}

export function createItemsWithKey<T>(value: T[]): ItemWithKey<T>[] {
  return value.map((x) => createItemWithKey(x));
}

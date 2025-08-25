export interface UnsavedChangesInfo {
  title: string;
  message: string;
}

let unsavedChangesInfo: UnsavedChangesInfo | null = null;

export function getUnsavedChangesInfo() {
  return unsavedChangesInfo;
}

export function setUnsavedChangesInfo(info: UnsavedChangesInfo | null) {
  unsavedChangesInfo = info;
}

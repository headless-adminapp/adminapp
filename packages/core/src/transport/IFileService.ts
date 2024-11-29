export interface IFileService {
  uploadFile(
    file: File,
    options?: {
      onProgress?: (progress: number) => void;
      context?: Record<string, unknown>;
    }
  ): Promise<string>;
}

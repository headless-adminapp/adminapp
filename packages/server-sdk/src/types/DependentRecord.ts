export interface DependentRecord {
  logicalName: string;
  id: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any;
}

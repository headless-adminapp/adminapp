export type ChangedValues<T extends Record<string, any> = Record<string, any>> =
  Record<
    keyof T,
    | {
        previousValue: any;
        newValue: any;
      }
    | undefined
  >;

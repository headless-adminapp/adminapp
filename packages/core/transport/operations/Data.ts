export type Data<T> = {
  $entity: string;
} & T & {
    $expand?: { [key in keyof T]?: Data<Record<string, unknown>> };
  };

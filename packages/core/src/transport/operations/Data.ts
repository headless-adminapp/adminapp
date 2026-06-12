export type Data<T> = {
  $entity: string;
} & T & {
    $expand?: {
      [key in keyof T]?: Record<string, Data<Record<string, unknown>>>;
    };
  };

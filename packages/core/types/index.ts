export type IsRequired<A> = A extends {
  required: true;
}
  ? true
  : false;

export type Nullable<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | null;
};

export type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

export type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: T[K];
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

export type ArrayWithAtLeastOne<T> = [T, ...T[]];
export type ArrayGroupWithAtLeastOne<T> = ArrayWithAtLeastOne<
  ArrayWithAtLeastOne<T>
>;

export type AllowAsync<T> = T | (() => Promise<T>);

export type Localized<T> = Record<string, T>;

export type AllowArray<T> = T | T[];

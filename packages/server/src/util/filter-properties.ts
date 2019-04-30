export type FilterProperties<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

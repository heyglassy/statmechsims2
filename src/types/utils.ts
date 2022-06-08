export type Optional<T> = {
  [K in keyof T]+?: Optional<T[K]>;
};

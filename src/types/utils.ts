export type Optional<T> = {
  [K in keyof T]+?: T[K] extends T ? Optional<T[K]> : T[K];
};

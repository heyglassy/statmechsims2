export type Optional<T> = {
  [A in keyof T]?: T extends object ? Optional<T[A]> : T[A];
};

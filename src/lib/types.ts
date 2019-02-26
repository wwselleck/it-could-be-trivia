export const None = Symbol("none");
type None = typeof None;
export type Maybe<T> = T | None;
export type Result<T> = T | Error;

import { createThrottle } from ".";

export type Throttle<T, S> = (...args: T[]) => Promise<S>;
export type Resolve<S> = (value: S | PromiseLike<S>) => void;

export type CreateThrottle = <T, S>(
  callback: (args: T[][], promises: Resolve<S>[]) => void,
  delay: number
) => Throttle<T, S>;

const createThrottle: CreateThrottle;
export default createThrottle;

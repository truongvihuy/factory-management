// export type Result<T, E> = Success<T> | Failure<E>;

export const Result = {
  ok<T>(value: T): Success<T> {
    return {
      success: true,
      value,
    };
  },

  fail<E>(error: E): Failure<E> {
    return {
      success: false,
      error,
    };
  },
};

export interface Success<T> {
  readonly success: true;
  readonly value: T;
}

export interface Failure<E> {
  readonly success: false;
  readonly error: E;
}

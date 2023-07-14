import type { ZodIssue } from 'zod';

export enum StatusVariants {
  INPUT_ERROR = 'inputError',
  INTERNAL_ERROR = 'internalError',
  SUCCESS = 'success',
}

export type Response<T> =
  | {
      status: StatusVariants.INPUT_ERROR;
      errors: Pick<ZodIssue, 'path' | 'message'>[];
    }
  | {
      status: StatusVariants.INTERNAL_ERROR;
      message: unknown | string;
    }
  | {
      status: StatusVariants.SUCCESS;
      data: T;
    };

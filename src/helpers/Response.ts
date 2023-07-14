import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { isDebug } from './Utils';

type CustomNextResponse<T> = NextResponse<Response<T>>;

const inputErrorResponse = (errors: ZodError): CustomNextResponse<unknown> => {
  return NextResponse.json(
    {
      status: StatusVariants.INPUT_ERROR,
      errors: errors.issues.map((res) => ({
        path: res.path,
        message: res.message,
      })),
    },
    { status: 200 },
  );
};

const internalErrorResponse = (
  message: string,
  debugMessage: unknown = '',
  status: number,
): CustomNextResponse<unknown> => {
  return NextResponse.json(
    {
      status: StatusVariants.INTERNAL_ERROR,
      message: isDebug() ? debugMessage : message,
    },
    { status },
  );
};

/**
 * Return error based on error type
 * @param {ZodError | any} error ZodError or other error
 * @param {string} internalErrorMessage Message if error is internal
 * @returns {CustomNextResponse} NextResponse
 */
export function errorResponse(error: ZodError): CustomNextResponse<unknown>;
export function errorResponse(
  error: unknown,
  internalErrorMessage: string,
  status?: number,
): CustomNextResponse<unknown>;
export function errorResponse(
  error: ZodError | unknown,
  internalErrorMessage = '',
  status = 500,
): CustomNextResponse<unknown> {
  if (error instanceof ZodError) {
    return inputErrorResponse(error);
  }
  return internalErrorResponse(internalErrorMessage, error, status);
}

export const successResponse = <T>(data: T): CustomNextResponse<T> => {
  return NextResponse.json(
    {
      status: StatusVariants.SUCCESS,
      data,
    },
    { status: 200 },
  );
};

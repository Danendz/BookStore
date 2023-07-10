import { Response, StatusVariants } from "@/types/Response"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { isDebug } from "./Utils"

type CustomNextResponse = NextResponse<Response>

const inputErrorResponse = (errors: ZodError): CustomNextResponse => {
  return NextResponse.json({
    status: StatusVariants.INPUT_ERROR,
    errors: errors.issues.map((res) => ({ path: res.path, message: res.message }))
  }, { status: 200 })
}

const internalErrorResponse = (message: string, debugMessage: any = ""): CustomNextResponse => {
  return NextResponse.json({
    status: StatusVariants.INTERNAL_ERROR,
    message: isDebug() ? debugMessage : message
  }, { status: 200 })
}

/**
 * Return error based on error type
 * @param {ZodError | any} error ZodError or other error
 * @param {string} internalErrorMessage Message if error is internal
 * @returns {CustomNextResponse} NextResponse
 */
export function errorResponse(error: ZodError): CustomNextResponse
export function errorResponse(error: any, internalErrorMessage: string): CustomNextResponse
export function errorResponse(error: ZodError | any, internalErrorMessage: string = ""): CustomNextResponse {
  if (error instanceof ZodError) {
    return inputErrorResponse(error)
  }
  return internalErrorResponse(internalErrorMessage, error)
}

export const successResponse = (data: any): CustomNextResponse => {
  return NextResponse.json({
    status: StatusVariants.SUCCESS,
    data
  }, { status: 200 })
}

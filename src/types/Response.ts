import { ZodIssue } from "zod"

export type Response = {
  status: "inputError"
  errors: Pick<ZodIssue, "path" | "message">[]
} | {
  status: "internalError",
  message: string
} | {
  status: "success",
  data: any
}

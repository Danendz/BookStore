import { NextRequest } from "next/server"
import BookPrisma from '@/validations/Book'
import { errorResponse, successResponse } from "@/helpers/Response"

// TODO: Need to implement getting books by query params
export async function GET(_: NextRequest) {
  try {
    const books = await BookPrisma.book.findMany({
      select: {
        title: true,
        description: true
      },
    })
    return successResponse(books)
  } catch (err: any) {
    return errorResponse(err, "Failed to get books")
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    await BookPrisma.book.create({ data: body })
    return successResponse(null)
  } catch (err: any) {
    return errorResponse(err, "Failed to create a book")
  }
}

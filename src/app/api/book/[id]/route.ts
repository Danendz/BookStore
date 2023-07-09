import { NextRequest } from "next/server"
import BookPrisma from '@/validations/Book'
import { errorResponse, successResponse } from "@/helpers/Response"
import { parseToUint } from "@/helpers/Utils"

type Params = {
  params: {
    id: string
  }
}

type BookId = { id: string | number }

// TODO: Need to implement getting book by query params
export async function GET(_: NextRequest, { params }: Params) {
  let { id }: BookId = params

  try {
    id = parseToUint(id)

    const book = await BookPrisma.book.findFirstOrThrow({
      where: {
        id
      },
    })

    return successResponse(book)
  } catch (err: any) {
    return errorResponse(err, `Failed to get book. ID: ${id}`)
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  let { id }: BookId = params
  const body = await req.json()

  try {
    id = parseToUint(id)

    await BookPrisma.book.update({
      where: {
        id
      },
      data: body
    })
    return successResponse(null)
  } catch (err: any) {
    return errorResponse(err, `Failed to update book. ID: ${id}`)
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  let { id }: BookId = params

  try {
    id = parseToUint(id)

    await BookPrisma.book.delete({
      where: {
        id
      }
    });
    return successResponse(null)
  } catch (err: any) {
    return errorResponse(err, `Failed to delete book. ID: ${id}`)
  }
}

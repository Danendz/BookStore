import type { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/helpers/Response';
import { parseToUint } from '@/helpers/Utils';
import BookPrisma from '@/validations/Book';

type Params = {
  params: {
    id: string;
  };
};

type BookId = { id: string | number };

// TODO: Need to implement getting book by query params
export async function GET(_: NextRequest, { params }: Params) {
  let { id }: BookId = params;

  try {
    id = parseToUint(id);

    const book = await BookPrisma.book.findFirstOrThrow({
      where: {
        id,
      },
    });

    return successResponse(book);
  } catch (err) {
    return errorResponse(err, `Failed to get book. ID: ${id}`, 404);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  let { id }: BookId = params;

  try {
    const body = await req.json();
    id = parseToUint(id);

    const updated_book = await BookPrisma.book.update({
      where: {
        id,
      },
      data: body,
    });
    return successResponse(updated_book);
  } catch (err) {
    return errorResponse(err, `Failed to update book. ID: ${id}`, 404);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  let { id }: BookId = params;

  try {
    id = parseToUint(id);

    const deleted_book = await BookPrisma.book.delete({
      where: {
        id,
      },
    });
    return successResponse<typeof deleted_book>(deleted_book);
  } catch (err) {
    return errorResponse(err, `Failed to delete book. ID: ${id}`, 404);
  }
}

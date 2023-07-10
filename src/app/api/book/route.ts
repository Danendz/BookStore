import type { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/helpers/Response';
import BookPrisma from '@/validations/Book';

// TODO: Need to implement getting books by query params
export async function GET(_: NextRequest) {
  try {
    const books = await BookPrisma.book.findMany();
    return successResponse(books);
  } catch (err) {
    return errorResponse(err, 'Failed to get books');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created_book = await BookPrisma.book.create({ data: body });
    return successResponse(created_book);
  } catch (err) {
    return errorResponse(err, 'Failed to create a book');
  }
}

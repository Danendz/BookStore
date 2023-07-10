import type { Book, Prisma } from '@prisma/client';

import {
  createBookRaw,
  createMockRequest,
  getStatusErrorMessage,
} from '@/__tests__/utils';
import { GET, POST } from '@/app/api/book/route';
import prisma from '@/config/prisma';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { createBookData } from './test_data';

describe('/api/book API Endpoint', () => {
  const createBook = async (bookData: Prisma.BookUncheckedCreateInput) => {
    await createBookRaw(bookData);
  };

  const getBooks = async () => {
    const req = createMockRequest({
      method: 'GET',
    });
    const res = await GET(req);
    const data: Response<Book[]> = await res.json();
    return { res, data };
  };

  const postBook = async (body: Prisma.BookUncheckedCreateInput) => {
    const req = createMockRequest({
      method: 'POST',
      body,
    });
    const res = await POST(req);
    const data: Response<Book> = await res.json();
    return { res, data };
  };

  beforeEach(async () => {
    await prisma.book.deleteMany();
  });

  test(`GET empty array: Should return ${StatusVariants.SUCCESS} and empty array`, async () => {
    const { res, data } = await getBooks();
    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.SUCCESS);

    if (data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, data.status));
    }

    expect(data.data).toEqual([]);
  });

  test(`GET test book: Should return ${StatusVariants.SUCCESS} and a book`, async () => {
    await createBook(createBookData);
    const { res, data } = await getBooks();
    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.SUCCESS);

    if (data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, data.status));
    }

    expect(data.data).toHaveLength(1);

    const db_book_data = data.data[0];

    expect(db_book_data).toEqual(expect.objectContaining(createBookData));
  });

  test(`POST valid test book: Should return ${StatusVariants.SUCCESS} and create a book`, async () => {
    const { res, data } = await postBook(createBookData);

    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.SUCCESS);

    if (data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, data.status));
    }

    expect(data.data).toEqual(expect.objectContaining(createBookData));
  });

  test(`POST invalid test book: Should return ${StatusVariants.INPUT_ERROR} and not create a book`, async () => {
    const invalidBookData = createBookData;

    invalidBookData.title = '';
    invalidBookData.description = '';

    const { res, data } = await postBook(invalidBookData);

    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.INPUT_ERROR);

    if (data.status !== StatusVariants.INPUT_ERROR) {
      fail(getStatusErrorMessage(StatusVariants.INPUT_ERROR, data.status));
    }

    expect(data.errors).not.toBeNull();
  });
});

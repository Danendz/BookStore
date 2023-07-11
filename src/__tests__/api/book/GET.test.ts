import type { Book, Prisma } from '@prisma/client';

import { GET } from '@/app/api/book/route';
import prisma from '@/config/prisma';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { createMockRequest, getStatusErrorMessage } from '../utils';
import { createBookRaw } from './book_utils';
import { fake_book_data } from './test_data';

describe('GET method of /api/book API endpoint', () => {
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
    await createBook(fake_book_data);
    const { res, data } = await getBooks();
    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.SUCCESS);

    if (data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, data.status));
    }

    expect(data.data).toHaveLength(1);

    const db_book_data = data.data[0];

    expect(db_book_data).toEqual(expect.objectContaining(fake_book_data));
  });
});

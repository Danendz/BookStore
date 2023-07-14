import type { Book, Prisma } from '@prisma/client';

import {
  createMockRequest,
  getStatusErrorMessage,
} from '@/__tests__/api/utils';
import { POST } from '@/app/api/book/route';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { fake_book_data } from './test_data';

describe('POST method of /api/book API endpoint', () => {
  const postBook = async (body: Prisma.BookUncheckedCreateInput) => {
    const req = createMockRequest({
      method: 'POST',
      body,
    });
    const res = await POST(req);
    const data: Response<Book> = await res.json();
    return { res, data };
  };

  test(`POST valid test book: Should return ${StatusVariants.SUCCESS} and create a book`, async () => {
    const { res, data } = await postBook(fake_book_data);

    expect(res.status).toBe(200);
    expect(data.status).toEqual(StatusVariants.SUCCESS);

    if (data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, data.status));
    }

    expect(data.data).toEqual(expect.objectContaining(fake_book_data));
  });

  test(`POST invalid test book: Should return ${StatusVariants.INPUT_ERROR} and not create a book`, async () => {
    const invalidBookData = fake_book_data;

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

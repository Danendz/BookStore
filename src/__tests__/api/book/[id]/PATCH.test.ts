import type { Book, Prisma } from '@prisma/client';

import { PATCH } from '@/app/api/book/[id]/route';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { createMockRequest, getStatusErrorMessage } from '../../utils';
import { createAndGetBook } from '../book_utils';
import { fake_book_data } from '../test_data';

describe('PATCH method of /api/book/[id] API endpoint', () => {
  const patch_data = { ...fake_book_data, title: 'Patched book' };
  const invalid_id = "some invalid id"
  const non_existing_id = 999

  const patchBookById = async (
    id: string,
    body: Prisma.BookUncheckedUpdateInput,
  ) => {
    const req = createMockRequest({
      method: 'PATCH',
      body,
    });

    const data = await PATCH(req, { params: { id } });
    const res_data: Response<Book> = await data.json();

    return { data, res_data };
  };

  test(`PATCH book by id: Should return ${StatusVariants.SUCCESS} and a patched book`, async () => {
    const created_book = await createAndGetBook(fake_book_data);

    if (created_book === null) {
      fail('Book is not created');
    }

    const { data, res_data } = await patchBookById(
      created_book.id.toString(),
      patch_data,
    );

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.SUCCESS);

    if (res_data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, res_data.status));
    }

    expect(res_data.data).toEqual(expect.objectContaining(patch_data));
  });

  test(`PATCH book by invalid id: Should return ${StatusVariants.INPUT_ERROR} and errors`, async () => {
    const { data, res_data } = await patchBookById(invalid_id, patch_data);

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.INPUT_ERROR);

    if (res_data.status !== StatusVariants.INPUT_ERROR) {
      fail(getStatusErrorMessage(StatusVariants.INPUT_ERROR, res_data.status));
    }

    expect(res_data.errors).not.toBeNull();
  });

  test(`PATCH book by not existing id: Should return ${StatusVariants.INTERNAL_ERROR} and error message`, async () => {
    const { data, res_data } = await patchBookById(
      non_existing_id.toString(),
      patch_data,
    );
    expect(data.status).toBe(404);
    expect(res_data.status).toEqual(StatusVariants.INTERNAL_ERROR);

    if (res_data.status !== StatusVariants.INTERNAL_ERROR) {
      fail(
        getStatusErrorMessage(StatusVariants.INTERNAL_ERROR, res_data.status),
      );
    }

    expect(res_data.message).toEqual(
      expect.stringContaining(non_existing_id.toString()),
    );
  });
});

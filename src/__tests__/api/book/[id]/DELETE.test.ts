import type { Book } from '@prisma/client';

import { DELETE } from '@/app/api/book/[id]/route';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { createMockRequest, getStatusErrorMessage } from '../../utils';
import { createAndGetBook } from '../book_utils';
import { fake_book_data } from '../test_data';

describe('DELETE method of /api/book/[id] endpoint', () => {
  const invalid_id = 'some invalid id';
  const non_existing_id = 999;

  const deleteBookById = async (id: string) => {
    const req = createMockRequest({
      method: 'DELETE',
    });

    const data = await DELETE(req, { params: { id } });
    const res_data: Response<Book> = await data.json();

    return { data, res_data };
  };

  //Tests
  test(`DELETE book by id: Should return ${StatusVariants.SUCCESS} and a book`, async () => {
    const created_book = await createAndGetBook(fake_book_data);

    if (created_book === null) {
      fail('Failed to create a book');
    }

    const { data, res_data } = await deleteBookById(created_book.id.toString());

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.SUCCESS);

    if (res_data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, res_data.status));
    }

    expect(res_data.data).toEqual(expect.objectContaining(fake_book_data));
  });

  test(`DELETE book by invalid id: Should return ${StatusVariants.INPUT_ERROR} and errors`, async () => {
    const { data, res_data } = await deleteBookById(invalid_id);

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.INPUT_ERROR);

    if (res_data.status !== StatusVariants.INPUT_ERROR) {
      fail(getStatusErrorMessage(StatusVariants.INPUT_ERROR, res_data.status));
    }

    expect(res_data.errors).not.toBeNull();
  });

  test(`DELETE book by not existing id: Should return ${StatusVariants.INTERNAL_ERROR} and error message`, async () => {
    const { data, res_data } = await deleteBookById(non_existing_id.toString());
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

import type { Book, Prisma } from '@prisma/client';

import {
  createBookRaw,
  createMockRequest,
  getStatusErrorMessage,
} from '@/__tests__/utils';
import { DELETE, GET, PATCH } from '@/app/api/book/[id]/route';
import prisma from '@/config/prisma';
import type { Response } from '@/types/Response';
import { StatusVariants } from '@/types/Response';

import { createBookData } from '../test_data';

describe('/api/book/[id] API endpoint', () => {
  const bookData = {
    ...createBookData,
    title: 'book_id_test',
  };
  const patch_data = { ...bookData, title: 'New patched title' };
  const invalid_id = 'some invalid id';
  const not_existing_id = 999;

  const createAndGetBook = async () => {
    await createBookRaw(bookData);
    const book = await prisma.book.findFirst({
      where: {
        title: bookData.title,
      },
    });
    return book;
  };

  const getBookById = async (id: string) => {
    const req = createMockRequest({
      method: 'GET',
    });

    const data = await GET(req, { params: { id } });
    const res_data: Response<Book> = await data.json();
    return { data, res_data };
  };

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

  const deleteBookById = async (id: string) => {
    const req = createMockRequest({
      method: 'DELETE',
    });

    const data = await DELETE(req, { params: { id } });
    const res_data: Response<Book> = await data.json();

    return { data, res_data };
  };

  //Tests
  test(`GET book by id: Should return ${StatusVariants.SUCCESS} and a book`, async () => {
    const created_book = await createAndGetBook();
    if (created_book === null) {
      fail('Book is not created!');
    }

    const { data, res_data } = await getBookById(created_book.id.toString());

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.SUCCESS);

    if (res_data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, res_data.status));
    }

    const book: Book = res_data.data;

    expect(book).toEqual(expect.objectContaining(bookData));
  });

  test(`GET book by invalid id: Should return ${StatusVariants.INPUT_ERROR} and input errors`, async () => {
    const { data, res_data } = await getBookById(invalid_id);

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.INPUT_ERROR);

    if (res_data.status !== StatusVariants.INPUT_ERROR) {
      fail(getStatusErrorMessage(StatusVariants.INPUT_ERROR, res_data.status));
    }

    expect(res_data.errors).not.toBeNull();
  });

  test(`Get book by not existing id: Should return ${StatusVariants.INTERNAL_ERROR} and error message`, async () => {
    const { data, res_data } = await getBookById(not_existing_id.toString());

    expect(data.status).toBe(404);
    expect(res_data.status).toEqual(StatusVariants.INTERNAL_ERROR);

    if (res_data.status !== StatusVariants.INTERNAL_ERROR) {
      fail(
        getStatusErrorMessage(StatusVariants.INTERNAL_ERROR, res_data.status),
      );
    }

    expect(res_data.message).toEqual(
      expect.stringContaining(not_existing_id.toString()),
    );
  });

  test(`PATCH book by id: Should return ${StatusVariants.SUCCESS} and a patched book`, async () => {
    const created_book = await createAndGetBook();

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
      not_existing_id.toString(),
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
      expect.stringContaining(not_existing_id.toString()),
    );
  });

  test(`DELETE book by id: Should return ${StatusVariants.SUCCESS} and a book`, async () => {
    const created_book = await createAndGetBook();

    if (created_book === null) {
      fail('Failed to create a book');
    }

    const { data, res_data } = await deleteBookById(created_book.id.toString());

    expect(data.status).toBe(200);
    expect(res_data.status).toEqual(StatusVariants.SUCCESS);

    if (res_data.status !== StatusVariants.SUCCESS) {
      fail(getStatusErrorMessage(StatusVariants.SUCCESS, res_data.status));
    }

    expect(res_data.data).toEqual(expect.objectContaining(bookData));
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
    const { data, res_data } = await deleteBookById(not_existing_id.toString());
    expect(data.status).toBe(404);
    expect(res_data.status).toEqual(StatusVariants.INTERNAL_ERROR);

    if (res_data.status !== StatusVariants.INTERNAL_ERROR) {
      fail(
        getStatusErrorMessage(StatusVariants.INTERNAL_ERROR, res_data.status),
      );
    }

    expect(res_data.message).toEqual(
      expect.stringContaining(not_existing_id.toString()),
    );
  });
});

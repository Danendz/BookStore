import type { Prisma } from '@prisma/client';

import prisma from '@/config/prisma';

export const createBookRaw = async (
  bookData: Prisma.BookUncheckedCreateInput,
) => {
  await prisma.book.create({ data: bookData });
};

export const createAndGetBook = async (
  bookData: Prisma.BookUncheckedCreateInput,
) => {
  await createBookRaw(bookData);
  const book = await prisma.book.findFirst({
    where: {
      title: bookData.title,
    },
  });
  return book;
};

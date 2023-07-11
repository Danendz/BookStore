import type { Prisma } from '@prisma/client';

export const fake_book_data = {
  title: 'Test book',
  genre: ['HORROR'],
  description: 'Test book description',
  userId: 1,
} satisfies Prisma.BookUncheckedCreateInput;

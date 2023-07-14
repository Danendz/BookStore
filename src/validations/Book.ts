import type { Prisma } from '@prisma/client';
import { Genre } from '@prisma/client';
import { z } from 'zod';

import prisma from '@/config/prisma';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_GENRE_LENGTH,
  MIN_TITLE_LENGTH,
} from '@/constants/Book';

const BookCreateInput = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(
      MIN_TITLE_LENGTH,
      `Book title must be at least ${MIN_TITLE_LENGTH} character`,
    )
    .max(
      MAX_TITLE_LENGTH,
      `Maximum length of book title is: ${MAX_TITLE_LENGTH}`,
    ),

  genre: z
    .array(
      z.nativeEnum(Genre, {
        errorMap: () => ({ message: 'You selected not existing genre' }),
      }),
    )
    .min(MIN_GENRE_LENGTH, 'You should pick at least 1 genre')
    .refine(
      (genres) => new Set(genres).size === genres.length,
      'Genres must be unique',
    ),

  description: z
    .string({
      required_error: 'Description is required',
    })
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Your description is too long. Maximum length is ${MAX_DESCRIPTION_LENGTH}`,
    ),

  userId: z.number({
    required_error: 'Author id is required',
  }),
}) satisfies z.Schema<Prisma.BookUncheckedCreateInput>;

export default prisma.$extends({
  query: {
    book: {
      create({ args, query }) {
        args.data = BookCreateInput.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = BookCreateInput.partial().parse(args.data);
        return query(args);
      },
    },
  },
});

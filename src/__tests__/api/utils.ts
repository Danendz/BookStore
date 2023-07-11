import type { Prisma } from '@prisma/client';
import { createRequest } from 'node-mocks-http';

import prisma from '@/config/prisma';
import type { StatusVariants } from '@/types/Response';

type TestRequest =
  | {
      method: 'POST' | 'PATCH';
      body?: any;
    }
  | {
      method: 'GET';
      params?: any;
    }
  | {
      method: 'DELETE';
    };

export const createMockRequest = (req: TestRequest) => {
  const newReq = createRequest(req);

  newReq['json'] = async function () {
    return this.body ?? {};
  };

  return newReq;
};

export const createUserRaw = async (name?: string, email?: string) => {
  await prisma.user.create({
    data: {
      name: name ?? 'test-user',
      email: email ?? 'test-user@mail.com',
    },
  });
};

export const getStatusErrorMessage = (
  expected: StatusVariants,
  got: StatusVariants,
): string => {
  return `ERROR: Expected status: ${expected}, but got : ${got}`;
};

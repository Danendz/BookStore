import { createMocks, createRequest, RequestMethod, RequestOptions } from 'node-mocks-http'
import { GET, POST } from '@/app/api/book/route'
import { Response, StatusVariants } from '@/types/Response'
import { Book, Prisma } from '@prisma/client'
import prisma from '@/config/prisma'
import { createNextRequest } from '@/helpers/MockNextRequest'
import { NextRequest } from 'next/server'

createRequest.prototype.json = async function (req: RequestOptions) {
  return req.body
}

describe('/api/book API Endpoint', () => {
  const bookData: Prisma.BookUncheckedCreateInput = {
    title: "Test book",
    genre: ['HORROR'],
    description: "Test book description",
    userId: 1
  }

  const createGetRequest = () => {
    return createNextRequest({
      method: 'GET'
    })
  }

  const createPostRequest = (body: Prisma.BookUncheckedCreateInput) => {
    return createNextRequest({
      method: 'POST',
      body
    })
  }

  const createBook = async (bookData: Prisma.BookUncheckedCreateInput) => {
    await prisma.book.create({ data: bookData })
  }

  const getBooks = async () => {
    const req = createGetRequest()
    const res = await GET(req)
    const data: Response = await res.json()
    return { res, data }
  }

  const postBook = async (body: Prisma.BookUncheckedCreateInput) => {
    const req = createPostRequest(body)
    const res = await POST(req)
    const data: Response = await res.json()
    return { res, data }
  }

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: "test-user",
        email: "test-user@mail.com"
      }
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
  })

  afterEach(async () => {
    await prisma.book.deleteMany()
  })

  test("GET empty array: Should return success and empty array", async () => {
    const { res, data } = await getBooks()
    expect(res.status).toBe(200)
    expect(data.status).toEqual(StatusVariants.SUCCESS)
    // @ts-expect-error
    expect(data.data).toEqual([])
  })

  test("GET test book: Should return success and a book", async () => {
    await createBook(bookData)
    const { res, data } = await getBooks()
    expect(res.status).toBe(200)
    expect(data.status).toEqual(StatusVariants.SUCCESS)

    if (data.status !== StatusVariants.SUCCESS) {
      fail(`ERROR: Status is not success. Status: ${data.status}`)
    }

    expect(data.data).toHaveLength(1)

    const db_book_data: Book = data.data[0]

    expect(db_book_data).toEqual(expect.objectContaining(bookData))
  })

  test("POST valid test book: Should return success and create a book", async () => {
    const { res, data } = await postBook(bookData)

    expect(res.status).toBe(200)
    expect(data.status).toEqual(StatusVariants.SUCCESS)

    if (data.status !== StatusVariants.SUCCESS) {
      fail(`ERROR: Status is not success. Status: ${data.status}`)
    }

    expect(data.data).toEqual(expect.objectContaining(bookData))
  })

  test("POST invalid test book: Should return inputError and not create a book", async () => {
    const invalidBookData = bookData

    invalidBookData.title = ""
    invalidBookData.description = ""

    const { res, data } = await postBook(invalidBookData)

    expect(res.status).toBe(200)
    expect(data.status).toEqual(StatusVariants.INPUT_ERROR)

    if (data.status !== StatusVariants.INPUT_ERROR) {
      fail(`ERROR: Status is not inputError. Status: ${data.status}`)
    }

    expect(data.errors).not.toBeNull()
  })

})

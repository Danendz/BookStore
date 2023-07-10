import { NextRequest } from "next/server";

type MockNextRequestMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface MockNextRequestParams {
  method: MockNextRequestMethods,
  body?: any
}

class MockNextRequest {
  public method: MockNextRequestMethods;
  public body: any

  constructor(
    params: MockNextRequestParams
  ) {
    this.method = params.method
    this.body = params.body ?? {}
  }

  public async json() {
    return this.body
  }
}

export function createNextRequest(params: MockNextRequestParams): NextRequest {
  return new MockNextRequest(params) as NextRequest
}

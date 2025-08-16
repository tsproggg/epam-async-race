export const HttpMethods = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
} as const;

export type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

export interface IFetch {
  url: string;
  method: HttpMethods;
  isJsonBody: boolean;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  query?: Record<string, string | number>;
}

export interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

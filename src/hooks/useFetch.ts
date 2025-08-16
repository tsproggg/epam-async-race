import { useEffect, useMemo, useState } from "react";

import fetchHelper from "../utils/fetchHelper";

import type { FetchResponse, IFetch } from "../types/FetchTypes";

export default function useFetch<ResponseT>(
  request: IFetch,
): FetchResponse<ResponseT> {
  const [data, setData] = useState<ResponseT | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { url, method, headers, query, isJsonBody, body } = request;

  const req = useMemo(
    (): IFetch => ({ url, method, headers, query, isJsonBody, body }) as IFetch,
    [url, method, headers, query, isJsonBody, body],
  );

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError(null);

    fetchHelper<ResponseT>(req, abortController.signal)
      .then((r: ResponseT) => setData(r))
      .catch((e: Error & { status?: number; body?: string }) => {
        if (e.name !== "AbortError") {
          setError(
            JSON.stringify({
              message: e.message,
              status: e.status,
              body: e.body,
            }),
          );
        }
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
  }, [req]);

  return { data, error, loading };
}

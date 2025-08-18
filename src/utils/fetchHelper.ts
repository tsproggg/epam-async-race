import type { IFetch } from "../types/FetchTypes";

// Params should already be added to the given url in the correct order
export default async function fetchHelper<ResponseT>(
  req: IFetch,
  abortSignal?: AbortSignal,
): Promise<ResponseT> {
  if (req.url.length === 0) {
    throw new Error("Missing URL parameter");
  }

  if (req.isJsonBody && !req.body) {
    throw new Error("Missing JSON body");
  }

  const urlObj = new URL(req.url);
  if (req.query && Object.keys(req.query).length > 0) {
    Object.entries(req.query).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value.toString());
    });
  }

  const url = urlObj.toString();

  const fetchReq: RequestInit = {
    method: req.method,
    headers: new Headers(req.headers ?? {}),
    signal: abortSignal,
  };

  if (req.body) {
    if (req.isJsonBody) {
      fetchReq.body = JSON.stringify(req.body);
      (fetchReq.headers as Headers).set("Content-Type", "application/json");
    } else {
      fetchReq.body = req.body.toString();
    }
  }

  const response = await fetch(url, fetchReq);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        message: errorText,
      }),
    );
  } else {
    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as ResponseT;
    }
    return (await response.text()) as ResponseT;
  }
}

// TODO: Read api url from environment variables
export const Links = {
  ROOT: "/",
  GARAGE: "/",
  WINNERS: "/winners",

  API_URL: "http://localhost:3000",
  ENDP_GARAGE: "/garage",
  ENDP_ENGINE: "/engine",
  ENDP_WINNERS: "/winners",
} as const;

export function makeApiUrl(...url: string[]): string {
  return new URL(url.join("/"), Links.API_URL).toString();
}

export type Links = (typeof Links)[keyof typeof Links];

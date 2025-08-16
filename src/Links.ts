// TODO: Read api url from environment variables
export const Links = {
  ROOT: "/",
  GARAGE: "/",
  WINNERS: "/winners",

  API_URL: "http://localhost:3000",
} as const;

export type Links = (typeof Links)[keyof typeof Links];

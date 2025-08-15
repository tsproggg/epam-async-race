export const Links = {
  ROOT: "/",
  GARAGE: "/",
  WINNERS: "/winners",
} as const;

export type Links = (typeof Links)[keyof typeof Links];

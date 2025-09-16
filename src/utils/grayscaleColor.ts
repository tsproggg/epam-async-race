import { hexColorRegex } from "../types/GlobalConst";

export default function grayscaleColor(color: string): number {
  if (color === null || !hexColorRegex.test(color)) {
    throw new Error("Invalid color");
  }

  const r = parseInt(color.substring(1, color.length === 7 ? 3 : 2), 16);
  const g = parseInt(
    color.substring(color.length === 7 ? 3 : 2, color.length === 7 ? 5 : 4),
    16,
  );
  const b = parseInt(color.substring(color.length === 7 ? 5 : 4), 16);

  return 0.299 * r + 0.587 * g + 0.114 * b;
}

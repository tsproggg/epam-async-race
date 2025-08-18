export default function randomItem<T>(array: T[]): T | null {
  if (array.length === 0) return null;

  const index = Math.floor(Math.random() * (array.length + 1));
  return array[index];
}

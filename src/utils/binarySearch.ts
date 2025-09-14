import type { IndexedObject } from "../types/Interfaces";

/**
 * Returns:
 * **null** - empty array,
 * id only - requested id doesn't exist, it's the index where the id can be inserted,
 * id and object - found object
 */
export default function binarySearch<T extends IndexedObject>(
  id: number,
  array: T[],
): { index: number; object: T | null } | null {
  if (array == null || array.length === 0) {
    return null;
  }

  let left = 0;
  let right = array.length - 1;
  let mid: number;
  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);

    if (array[mid].id === id) {
      return { index: mid, object: array[mid] };
    }
    if (array[mid].id < id) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // return the place where the index can be inserted
  return { index: left, object: null };
}

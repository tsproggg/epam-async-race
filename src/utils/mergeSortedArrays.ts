import type { IndexedObject } from "../types/Interfaces";

export default function mergeSortedArrays<T extends IndexedObject>(
  array1: T[],
  array2: T[],
): T[] {
  const mergedArray: T[] = [];
  let i = 0;
  let j = 0;

  while (i < array1.length && j < array2.length) {
    if (array1[i].id <= array2[j].id) {
      mergedArray.push(array1[i]);
      i += 1;
    } else {
      mergedArray.push(array2[j]);
      j += 1;
    }
  }

  while (i < array1.length) {
    mergedArray.push(array1[i]);
    i += 1;
  }

  while (j < array2.length) {
    mergedArray.push(array2[j]);
    j += 1;
  }

  return mergedArray;
}

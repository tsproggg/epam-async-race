import binarySearch from "../utils/binarySearch";

import type { ICar, IWinner } from "../types/ApiTypes";

export const cars: ICar[] = [
  { id: 1, name: "Tesla Model S", color: "red" },
  { id: 2, name: "Ford Mustang", color: "blue" },
  { id: 3, name: "BMW M3", color: "black" },
  { id: 4, name: "Audi R8", color: "white" },
  { id: 5, name: "Porsche 911", color: "yellow" },
];

export const winners: IWinner[] = [
  { id: 1, wins: 10, time: 120.5 },
  { id: 2, wins: 7, time: 132.3 },
  { id: 3, wins: 15, time: 110.8 },
  { id: 4, wins: 5, time: 145.2 },
  { id: 5, wins: 12, time: 118.9 },
  { id: 6, wins: 8, time: 125.4 },
];

test("cars-existing", () => {
  expect(binarySearch<ICar>(5, cars)).toEqual({
    index: 4,
    object: {
      color: "yellow",
      id: 5,
      name: "Porsche 911",
    },
  });
});

test("cars-non-existing", () => {
  expect(binarySearch<ICar>(95, cars)).toEqual({
    index: 5,
    object: null,
  });
});

test("empty-array", () => {
  expect(binarySearch<ICar>(2, [])).toEqual(null);
});

test("cars-first-element", () => {
  expect(binarySearch<ICar>(1, cars)).toEqual({
    index: 0,
    object: {
      id: 1,
      name: "Tesla Model S",
      color: "red",
    },
  });
});

test("cars-last-element", () => {
  expect(binarySearch<ICar>(5, cars)).toEqual({
    index: 4,
    object: {
      id: 5,
      name: "Porsche 911",
      color: "yellow",
    },
  });
});

test("single-element-array-existing", () => {
  const singleCar: ICar[] = [{ id: 10, name: "Mazda 3", color: "green" }];
  expect(binarySearch<ICar>(10, singleCar)).toEqual({
    index: 0,
    object: {
      id: 10,
      name: "Mazda 3",
      color: "green",
    },
  });
});

test("single-element-array-non-existing", () => {
  const singleCar: ICar[] = [{ id: 10, name: "Mazda 3", color: "green" }];
  expect(binarySearch<ICar>(11, singleCar)).toEqual({
    index: 1,
    object: null,
  });
});

test("winners-existing", () => {
  expect(binarySearch<IWinner>(3, winners)).toEqual({
    index: 2,
    object: {
      id: 3,
      wins: 15,
      time: 110.8,
    },
  });
});

test("winners-non-existing", () => {
  expect(binarySearch<IWinner>(-9, winners)).toEqual({
    index: 0,
    object: null,
  });
});

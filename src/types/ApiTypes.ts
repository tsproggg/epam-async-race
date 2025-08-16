import type { IndexedObject } from "./IndexedObject";

export interface ICar extends IndexedObject {
  name: string;
  color: string;
}

export interface IWinner extends IndexedObject {
  wins: number;
  time: number;
}

// TODO: Add types for /engine requests if needed

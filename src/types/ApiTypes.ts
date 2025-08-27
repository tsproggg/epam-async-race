import type { IndexedObject } from "./Interfaces";

export interface ICar extends IndexedObject {
  name: string;
  color: string;
}

export interface IWinner extends IndexedObject {
  wins: number;
  time: number;
}

export interface ICarRaceStats {
  velocity: number;
  distance: number;
}

export const EngineStatus = {
  STARTED: "started",
  STOPPED: "stopped",
  DRIVE: "drive",
} as const;

export type EngineStatus = (typeof EngineStatus)[keyof typeof EngineStatus];

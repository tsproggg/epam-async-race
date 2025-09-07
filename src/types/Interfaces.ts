import type { WinnersSorting } from "./GlobalConst";

// An interface to make sure that inherited interfaces have a numeric index field
export interface IndexedObject {
  id: number;
}

export interface IGlobalRaceCarStats extends IndexedObject {
  hasFinished: boolean;
  time: number;
}

export interface IRaceState {
  isGlobalRace: boolean;
  ongoing: boolean;
  racingCarId: number;
  pauseAnimations: boolean;
  resetAnimations: boolean;
}

export interface IStatePersistance {
  garageListPage: number;
  winnersListPage: number;
  winnersSorting: WinnersSorting;
}

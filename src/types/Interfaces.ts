import type { WinnersSorting } from "./GlobalConst";

// An interface to make sure that inherited interfaces have a numeric index field
export interface IndexedObject {
  id: number;
}

export interface IRaceState {
  isGlobalRace: boolean;
  ongoing: boolean;
}

export interface IStatePersistance {
  garageListPage: number;
  winnersListPage: number;
  winnersSorting: WinnersSorting;
}

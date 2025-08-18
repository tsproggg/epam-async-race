import { makeApiUrl } from "../Links";
import store, { GarageSlice } from "../store/store";
import { carModels, hexColorRegex, hexColors } from "../types/GlobalConst";
import fetchHelper from "../utils/fetchHelper";
import randomItem from "../utils/randomItem";

import type { ICar } from "../types/ApiTypes";

export default class GarageService {
  static async getGarage(): Promise<ICar[]> {
    const cars: ICar[] = await fetchHelper<ICar[]>({
      url: makeApiUrl("/garage"),
      method: "GET",
      isJsonBody: false,
    });

    store.dispatch(GarageSlice.actions.setItems(cars));

    return cars;
  }

  static async addCar(name: string, color: string): Promise<ICar> {
    if (!name || !hexColorRegex.test(color)) {
      throw new Error("Invalid arguments");
    }

    const carAdded = await fetchHelper<ICar>({
      url: makeApiUrl("/garage"),
      method: "POST",
      isJsonBody: true,
      body: { name, color },
    });

    store.dispatch(GarageSlice.actions.addItem(carAdded));
    return carAdded;
  }

  static deleteCar(id: number): boolean {
    // TODO: When the winners endpoints logic ready, remove the car from the leaderboard too
    if (id < 0) return false;

    fetchHelper<object>({
      url: makeApiUrl(`/garage/${id}`),
      method: "DELETE",
      isJsonBody: false,
    }).catch((error: string) => {
      if (JSON.parse(error).status === 404) {
        return false;
      }
      throw new Error(error);
    });

    store.dispatch(GarageSlice.actions.removeItem(id));
    return true;
  }

  static generateCars(carsNumber: number): void {
    for (let i = 0; i < carsNumber; i += 1) {
      this.addCar(randomItem(carModels) ?? "", randomItem(hexColors) ?? "");
    }
  }
}
